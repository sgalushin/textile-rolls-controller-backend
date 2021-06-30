import DynamoDB from "aws-sdk/clients/dynamodb";
import { Table } from "dynamodb-toolbox";

export const createRollsTableDefinition = () => {
  const documentClient = new DynamoDB.DocumentClient({
    region: process.env.AWS_REGION!,
    endpoint: process.env.DYNAMO_DB_ENDPOINT,
  });

  return new Table({
    name: process.env.ROLLS_TABLE!,
    partitionKey: "pk",
    sortKey: "sk",
    indexes: {
      gs1: { partitionKey: "gs1pk", sortKey: "gs1sk" },
      gs2: { partitionKey: "gs2pk", sortKey: "gs2sk" },
    },
    DocumentClient: documentClient,
  });
};
