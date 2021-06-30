import { createDescendantRollInput, RollsStorage } from "./RollsStorage";
import { createLocalTable, setEnvironmentVariablesForDynamoDBLocalTesting } from "../test-support/commonForLocalDynamoDBServiceTests";
import { RollReference } from "./RollReference";
import { createRollInputSample1, userSample1 } from "../test-support/objectSamples";
import MockDate from "mockdate";

let storage: RollsStorage;

beforeAll(() => {
  setEnvironmentVariablesForDynamoDBLocalTesting();
});

beforeEach(async () => {
  const tableName = await createLocalTable();
  process.env.ROLLS_TABLE = tableName;
  storage = new RollsStorage();
});

test("Create a new roll and read it", async () => {
  const ref = await storage.createRoll(createRollInputSample1);

  const received = await storage.getRoll(ref);

  expect(received.id).toBe(ref.id);
  expect(received.version).toBe(ref.version);
  expect(received.totalLength).toBe(createRollInputSample1.totalLength);
});

test("When getting a non-existent roll, get null", async () => {
  const ref = await RollReference.createRandom();

  const received = await storage.getRoll(ref);

  expect(received).toBe(null);
});

describe("Update a roll", () => {
  test("and check that for an updated roll an id is retained, but a new version is created", async () => {
    const ref1 = await storage.createRoll(createRollInputSample1);
    const ref2 = await storage.updateRoll({
      ref: ref1,
      user: userSample1,
    });

    expect(ref1.id).toBe(ref2.id);
    expect(ref1.version).not.toBe(ref2.version);
  });

  test.todo("With the same version and get an error");

  test("and check that 'previous version' is correctly filled", async () => {
    const ref1 = await storage.createRoll(createRollInputSample1);
    const ref2 = await storage.updateRoll({
      ref: ref1,
      user: userSample1,
    });

    const newVersion = await storage.getRoll(ref2);
    expect(newVersion.previousVersion).toBe(ref1.version);
  });
  test("when the roll being updated is not the latest version, and fail", async () => {
    const ref1 = await storage.createRoll(createRollInputSample1);
    const unpackedRef1 = JSON.parse(JSON.stringify(ref1));
    const ref2 = await storage.updateRoll({
      ref: unpackedRef1,
      user: userSample1,
    });

    await expect(
      storage.updateRoll({
        ref: ref1,
        user: userSample1,
      })
    ).rejects.toThrow();
  });
});

describe("When trying to get the latest roll reference", () => {
  test("for a non-existing roll, raise an error", async () => {
    await expect(storage.getLatestRoll("111111111")).rejects.toThrow();
  });

  test("for a single roll, return reference for this roll", async () => {
    const ref = await storage.createRoll(createRollInputSample1);
    const latestRoll = await storage.getLatestRoll(ref.id);
    expect(ref.id).toBe(latestRoll.id);
    expect(ref.version).toBe(latestRoll.version);
  });

  test("for a multiple rolls, return the reference for the latest one", async () => {
    const ref1 = await storage.createRoll(createRollInputSample1);
    const ref2 = await storage.updateRoll({
      ref: ref1,
      totalLength: 300,
      user: userSample1,
    });

    const latestRef = await storage.getLatestRoll(ref1.id);

    expect(ref1.id).toBe(ref2.id);
    expect(ref1.id).toBe(latestRef.id);
    expect(ref2.version).toBe(latestRef.version);
  });
});

describe("Get all rolls by physical id", () => {
  test("when there is one roll", async () => {
    const ref1 = await storage.createRoll(createRollInputSample1);
    const savedRoll = await storage.getRoll(ref1);

    const results = await storage.getAllRollsByPhysicalId(savedRoll.physicalId);
  });

  test("when there are two versions of one roll and another independent roll", async () => {
    const _ = await storage.createRoll(createRollInputSample1);
    const ref1 = await storage.createRoll(createRollInputSample1);
    const ref2 = await storage.updateRoll({
      ref: ref1,
      user: userSample1,
    });

    const roll1 = await storage.getRoll(ref1);
    const roll2 = await storage.getRoll(ref2);

    expect(roll1.physicalId).toBe(roll2.physicalId);

    const results = await storage.getAllRollsByPhysicalId(roll1.physicalId);
    expect(results.Count).toBe(2);
  });
});

describe("Get all rolls by date", () => {
  test("when there also exist rolls belonging to a different date", async () => {
    MockDate.set("2020-01-01");
    const date1 = new Date();
    const ref1 = await storage.createRoll(createRollInputSample1);
    MockDate.set("2020-01-02");
    const date2 = new Date();
    const ref2 = await storage.createRoll(createRollInputSample1);
    const ref3 = await storage.createRoll(createRollInputSample1);

    const resultsFromDate1 = await storage.getAllRollsByDate(date1);
    expect(resultsFromDate1.Items.length).toBe(1);

    const resultsFromDate2 = await storage.getAllRollsByDate(date2);
    expect(resultsFromDate2.Items.length).toBe(2);
  });

  test("when there exist no rolls at this date", async () => {
    MockDate.set("2020-01-01");
    const date1 = new Date();
    MockDate.set("2020-01-02");
    const date2 = new Date();
    const ref2 = await storage.createRoll(createRollInputSample1);
    const ref3 = await storage.createRoll(createRollInputSample1);

    const resultsFromDate1 = await storage.getAllRollsByDate(date1);
    expect(resultsFromDate1.Items.length).toBe(0);

    const resultsFromDate2 = await storage.getAllRollsByDate(date2);
    expect(resultsFromDate2.Items.length).toBe(2);
  });
});

describe("Create a descendant roll", () => {
  test("based on a non-existing parent roll and get an error", async () => {
    const ref1 = await RollReference.createRandom();
    const input: createDescendantRollInput = {
      parentRef: ref1,
      user: userSample1,
      totalLength: 100,
      firstClassLength: 200,
      quality: {},
    };

    await expect(storage.createDescendantRoll(input)).rejects.toThrow();
  });

  test("based on a previous version of a parent roll and get an error", async () => {
    const ref1 = await storage.createRoll(createRollInputSample1);
    const unpackedRef1 = JSON.parse(JSON.stringify(ref1));
    const ref2 = await storage.updateRoll({
      ref: ref1,
      user: userSample1,
    });

    const input: createDescendantRollInput = {
      parentRef: ref1,
      user: userSample1,
      totalLength: 100,
      firstClassLength: 200,
      quality: {},
    };

    await expect(storage.createDescendantRoll(input)).rejects.toThrow();
  });

  test("with new Ref provided in the Input and read the new roll", async () => {
    const ref1 = await storage.createRoll(createRollInputSample1);
    const descendantRef = await RollReference.createRandom();
    const input: createDescendantRollInput = {
      parentRef: ref1,
      newRef: descendantRef,
      user: userSample1,
      totalLength: 100,
      firstClassLength: 200,
      quality: {},
    };

    const descendantRefReceived = await storage.createDescendantRoll(input);
    expect(descendantRef.id).toBe(descendantRefReceived.id);
    expect(descendantRef.version).toBe(descendantRefReceived.version);
  });

  test("without Ref (e.g. generate new Ref) and read the new roll", async () => {
    // console.log();
  });
});
