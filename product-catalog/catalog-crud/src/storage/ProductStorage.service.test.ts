/*
 * @group service
 *
 * Service test, requires running DynamoDB local on port 8000
 * Docker command to start DynamoDB: `docker run -p 8000:8000 -d amazon/dynamodb-local`
 *
 * For each test a new table is created with a random name, so rerunning a test will not result in any interference
 * with previous tests.
 *
 * Tables are not deleted after test for speed and utility. It is expected that DynamoDB is run with ephemeral storage,
 * and each time it's container is started no tables exist.
 */

import { ProductStorage } from "./ProductStorage";
import {
  checkCharacteristicFields,
  checkProductFields,
  createLocalTable,
  getById,
  setEnvironmentVariablesForDynamoDBLocalTesting,
} from "../test-support/commonForLocalDynamoDBServiceTests";
import {
  prod1char1,
  prod1char1v4,
  prod1char2,
  prod2char1,
  product1,
  product1v2,
  product1v4,
  product2,
} from "../test-support/objectSamples";

let storage: ProductStorage;

beforeAll(() => {
  setEnvironmentVariablesForDynamoDBLocalTesting();
});

beforeEach(async () => {
  const tableName = await createLocalTable();
  process.env.PRODUCT_TABLE = tableName;
  storage = new ProductStorage();
});

describe("Save an object and read it", () => {
  test("For a product", async () => {
    await storage.saveProduct(product1);
    const received = await storage.getProduct(product1.id);

    checkProductFields(received, product1);
  });

  test("For a characteristic", async () => {
    await storage.saveCharacteristic(prod1char1);

    const received = await storage.getCharacacteristic(prod1char1.productId, prod1char1.id);
    checkCharacteristicFields(received, prod1char1);
  });
});

describe("Write the same version of an object twice and check the amount of stored items", () => {
  test("For a product", async () => {
    await storage.saveProduct(product1);
    await storage.saveProduct(product1);

    const result = await storage.getAllProducts();
    expect(result.length).toBe(1);
  });

  test("For a characteristic", async () => {
    await storage.saveCharacteristic(prod1char1);
    await storage.saveCharacteristic(prod1char1);

    const result = await storage.getAllCharacteristics(prod1char1.productId);
    expect(result.length).toBe(1);
  });
});

describe("Save two objects and read them all", () => {
  test("For products", async () => {
    await storage.saveProduct(product1);
    await storage.saveProduct(product2);

    const res = await storage.getAllProducts();
    expect(res.length).toBe(2);
    checkProductFields(getById(res, product1.id), product1);
    checkProductFields(getById(res, product2.id), product2);
  });

  test("For characteristics of the same product", async () => {
    // The test characteristics should belong to the same product
    expect(product1.id).toBe(prod1char1.productId);
    expect(prod1char1.productId).toBe(prod1char2.productId);

    await storage.saveProduct(product1);
    await storage.saveCharacteristic(prod1char1);
    await storage.saveCharacteristic(prod1char2);

    // The characteristic of another product should not be in the results
    await storage.saveCharacteristic(prod2char1);

    const res = await storage.getAllCharacteristics(prod1char1.productId);
    expect(res.length).toBe(2);
    checkCharacteristicFields(getById(res, prod1char1.id), prod1char1);
    checkCharacteristicFields(getById(res, prod1char2.id), prod1char2);
  });
});

describe("Update an object with a new version and read it", () => {
  test("For a characteristic", async () => {
    await storage.saveCharacteristic(prod1char1);
    await storage.saveCharacteristic(prod1char2);

    const received = await storage.getCharacacteristic(prod1char2.productId, prod1char2.id);
    checkCharacteristicFields(received, prod1char2);
  });

  test("For a product", async () => {
    await storage.saveProduct(product1);
    await storage.saveProduct(product1v2);

    const received = await storage.getProduct(product1.id);
    checkProductFields(received, product1v2);
  });
});

describe("Try to update an object with a not-a-next version and receive an error", () => {
  test("For a product", async () => {
    await storage.saveProduct(product1v2);

    // V4 should not overwrite V2, as we should wait for V3 first
    await expect(storage.saveProduct(product1v4)).rejects.toThrowError();
  });

  test("For a characteristic", async () => {
    await storage.saveCharacteristic(prod1char1);

    // V4 should not overwrite V1, as we should wait for V2 first
    await expect(storage.saveCharacteristic(prod1char1v4)).rejects.toThrowError();
  });
});

test("Try to get a product that doesn't exist and get null", async () => {
  const received = await storage.getProduct("non-existant-guid");

  expect(received).toBe(null);
});

test.todo("Gets all products when the response is > 1MB (bigger than the limit for DynamoDB response)");
