/*
 * Common functions for tests using local DynamoDB
 */

import KSUID from "ksuid";
import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const LOCAL_REGION = process.env.DYNAMODB_TEST_REGION ?? "eu-west-1"; // doesn't matter for local DynamoDB, it just needs to be set
const LOCAL_ENDPOINT = process.env.DYNAMODB_TEST_URL ?? "http://localhost:8000";

export const createLocalTable = async () => {
  const tableName = `product-catalog-${(await KSUID.random()).string}`;
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

export const checkProductAndCharCommonFields = (received: any, expected: any) => {
  expect(received.id).toBe(expected.id);
  expect(received.deletionMark).toBe(expected.deletionMark);
  expect(received.version).toBe(expected.version);
  expect(received.name).toBe(expected.name);
};

export const checkProductSpecificFields = (received: any, expected: any) => {
  checkProductAndCharCommonFields(received, expected);
  expect(received.sku).toBe(expected.sku);
};

export const checkCharacteristicSpecificFields = (received: any, expected: any) => {
  checkProductAndCharCommonFields(received, expected);
  expect(received.productId).toBe(expected.productId);

  // Characteristic has either `picture` or `color` field, but not both
  if (expected.color) {
    expect(received.color).toStrictEqual(expected.color);
    expect(received.picture).toEqual(undefined);
  } else {
    expect(received.color).toEqual(undefined);
    expect(received.picture).toStrictEqual(expected.picture);
  }
};

interface hasIdField {
  id: string;
}
export const getById = (array: Array<hasIdField>, id: string) => {
  return array.find((e) => e.id == id);
};
