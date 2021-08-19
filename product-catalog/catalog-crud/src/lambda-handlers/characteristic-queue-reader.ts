import lambda from "aws-lambda";
import { processRecords } from "../queue-processing/QueueProcessor";

export const lambdaHandler = async (event: lambda.SQSEvent) => {
  await processRecords("characteristic", event.Records);
};
