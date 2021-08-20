import { SQSClient, DeleteMessageBatchCommand, DeleteMessageBatchRequestEntry } from "@aws-sdk/client-sqs";
import { ProductStorage } from "../storage/ProductStorage";
import { SQSRecord } from "aws-lambda";
import { splitArrayIntoEqualChunks } from "./splitArrayIntoEqualChunks";
import { fetchRGBForPantone } from "../pantone/fetchRGBForPantone";

type EntityName = "product" | "characteristic";

type ObjectsProcessedUnsuccessfully = {
  entity: EntityName;
  error: Error;
  data: string;
}[];

/**
 * Reads SQS Records, extracts products or characteristics and saves them to DynamoDB
 * Successfully saved messages are removed from the queue.
 * If at least one SQS Record was not processed successfully, throws an error.
 */
export const processRecords = async (entityName: EntityName, records: SQSRecord[]) => {
  const sqs = new SQSClient({
    region: process.env.AWS_REGION,
  });
  const productStorage = new ProductStorage();

  let messagesToRemove: DeleteMessageBatchRequestEntry[] = [];
  let processedWithError: ObjectsProcessedUnsuccessfully = [];

  const processRecord = async (record: SQSRecord) => {
    const obj = JSON.parse(record.body);
    if (entityName == "characteristic") {
      await addRGBForCharacteristicColor(obj);
    }
    await productStorage[entityName == "product" ? "saveProduct" : "saveCharacteristic"](obj);
  };

  for (const record of records) {
    try {
      await processRecord(record);
      messagesToRemove.push({ Id: record.messageId, ReceiptHandle: record.receiptHandle });
    } catch (e) {
      processedWithError.push({
        entity: entityName,
        error: e.toString(),
        data: record.body,
      });
    }
  }

  // Maximum number of elements in DeleteBatchCommand is 10 (limitation of AWS API)
  for (const msgToRemoveChunk of splitArrayIntoEqualChunks(messagesToRemove, 10)) {
    await sqs.send(
      new DeleteMessageBatchCommand({
        QueueUrl: process.env.QUEUE!,
        Entries: msgToRemoveChunk,
      })
    );
  }

  if (processedWithError.length) {
    throw new Error(`Following messages were not processed: ${JSON.stringify(processedWithError)}`);
  }
};

/*
 * Tries to fetch the corresponding RGB, if a payload is a characteristic with a color defined in pantone.
 * If any errors happen during fetching the RGB fails silently, as this is not an important field and is used for
 * improving UX only.
 */
const addRGBForCharacteristicColor = async (obj: any) => {
  const pantone = obj?.color?.pantone;
  if (!pantone) {
    return;
  }
  try {
    const rgb = await fetchRGBForPantone(pantone);
    obj.color = { ...obj.color, ...rgb };
  } catch (e) {
    console.log(`Error fetching RGB for pantone ${pantone}: ${e.toString()}`);
  }
};
