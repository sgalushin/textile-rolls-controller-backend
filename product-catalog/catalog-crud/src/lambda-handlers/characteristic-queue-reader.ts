import lambda from "aws-lambda";
import { processRecords } from "../QueueProcessor";

export const lambdaHandler = async (event: lambda.SQSEvent) => {
  await processRecords("characteristic", event.Records);
};
