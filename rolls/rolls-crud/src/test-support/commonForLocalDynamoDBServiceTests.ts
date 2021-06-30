/*
 * @group service
 *
 * Common functions for service tests using DynamoDB Local
 */

import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import KSUID from "ksuid";

const LOCAL_REGION = "eu-west-1"; // doesn't matter for local DynamoDB, it just needs to be set
const LOCAL_ENDPOINT = "http://localhost:8000";

export const createLocalTable = async () => {
  const tableName = `rolls-${(await KSUID.random()).string}`;
  const localClient = new DynamoDBClient({
    region: LOCAL_REGION,
    endpoint: LOCAL_ENDPOINT,
  });

  const createTableCmd = new CreateTableCommand({
    TableName: tableName,
    KeySchema: [
      {
        AttributeName: "pk",
        KeyType: "HASH",
      },
      {
        AttributeName: "sk",
        KeyType: "RANGE",
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: "pk",
        AttributeType: "S",
      },
      {
        AttributeName: "sk",
        AttributeType: "S",
      },
      {
        AttributeName: "gs1pk",
        AttributeType: "S",
      },
      {
        AttributeName: "gs1sk",
        AttributeType: "S",
      },
      {
        AttributeName: "gs2pk",
        AttributeType: "S",
      },
      {
        AttributeName: "gs2sk",
        AttributeType: "S",
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: "gs1",
        Projection: {
          ProjectionType: "ALL",
        },
        KeySchema: [
          {
            AttributeName: "gs1pk",
            KeyType: "HASH",
          },
          {
            AttributeName: "gs1sk",
            KeyType: "RANGE",
          },
        ],
      },
      {
        IndexName: "gs2",
        Projection: {
          ProjectionType: "ALL",
        },
        KeySchema: [
          {
            AttributeName: "gs2pk",
            KeyType: "HASH",
          },
          {
            AttributeName: "gs2sk",
            KeyType: "RANGE",
          },
        ],
      },
    ],
    BillingMode: "PAY_PER_REQUEST",
  });

  await localClient.send(createTableCmd);
  return tableName;
};

export const setEnvironmentVariablesForDynamoDBLocalTesting = () => {
  process.env.AWS_REGION = LOCAL_REGION;
  process.env.DYNAMO_DB_ENDPOINT = LOCAL_ENDPOINT;
};
