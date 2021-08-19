import { processRecords } from "./QueueProcessor";
import { product1 } from "../test-support/objectSamples";
import { record1 } from "../test-support/sqsRecordSamples";
import { createLocalTable, setEnvironmentVariablesForDynamoDBLocalTesting } from "../test-support/commonForLocalDynamoDBTests";
import { ProductStorage } from "../storage/ProductStorage";

jest.mock("@aws-sdk/client-sqs");

let storage: ProductStorage;

beforeAll(() => {
  setEnvironmentVariablesForDynamoDBLocalTesting();
});

beforeEach(async () => {
  process.env.PRODUCT_TABLE = await createLocalTable();
  storage = new ProductStorage();
});

describe("Must not write anything to DB when receives incorrect message, must throw an error", () => {
  test("for product message", async () => {
    const record1incorrect = {
      ...record1,
      body: "Something incorrect",
    };
    await expect(processRecords("product", [record1incorrect])).rejects.toThrowError();
  });
});

describe("Must not throw an error when receives the same message twice", () => {
  test("for product message", async () => {
    const record1prod1 = {
      ...record1,
      body: JSON.stringify(product1),
    };

    await processRecords("product", [record1prod1, record1prod1]);

    const res = await storage.getAllProducts();
    expect(res.length).toBe(1);
  });
});

describe("When receives both correct and incorrect messages, must process the correct one and throw an error with incorrect", () => {
  test("for products", async () => {
    const record1prod1 = {
      ...record1,
      body: JSON.stringify(product1),
    };
    const record1prod1incorrect = {
      ...record1,
      body: JSON.stringify(product1) + "??<../",
    };

    await expect(processRecords("product", [record1prod1incorrect, record1prod1])).rejects.toThrowError();

    const res = await storage.getAllProducts();
    expect(res.length).toBe(1);
  });
});
