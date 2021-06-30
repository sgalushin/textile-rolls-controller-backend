import { lambdaHandler } from "./get-all-rolls-by-date";
import { APIGatewayEvent } from "aws-lambda";
import MockDate from "mockdate";
import { createRollInputSample1 } from "../test-support/objectSamples";
import { RollsStorage } from "../storage/RollsStorage";
import { createLocalTable, setEnvironmentVariablesForDynamoDBLocalTesting } from "../test-support/commonForLocalDynamoDBServiceTests";
let storage: RollsStorage;

beforeAll(() => {
  setEnvironmentVariablesForDynamoDBLocalTesting();
});

beforeEach(async () => {
  const tableName = await createLocalTable();
  process.env.ROLLS_TABLE = tableName;
  storage = new RollsStorage();
});

test("Create two rolls belonging to one date and fetch them", async () => {
  MockDate.set("2020-01-01");

  const ref2 = await storage.createRoll(createRollInputSample1);
  const ref3 = await storage.createRoll(createRollInputSample1);

  const event = {
    body: JSON.stringify({
      date: new Date(),
    }),
  };

  const response = await lambdaHandler(event as APIGatewayEvent);
  expect(response.statusCode).toBe(200);
});
