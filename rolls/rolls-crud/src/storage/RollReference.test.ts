import { RollReference } from "./RollReference";

test("Creates a non-empty ref", async () => {
  const ref = await RollReference.createRandom();

  expect(ref.id).not.toHaveLength(0);
  expect(ref.version).not.toHaveLength(0);
});

test("When creating a new version, id stays the same and the version changes", async () => {
  const ref1 = await RollReference.createRandom();
  const ref2 = await ref1.createNewVersion();

  expect(ref1.id).toBe(ref2.id);

  expect(ref1.version).not.toBe(ref2.version);
  expect(ref2.version).not.toHaveLength(0);
});

test("Creates a Ref from an object with fields 'id' and 'version'", () => {
  const obj = {
    id: "aaa",
    version: "bbb",
  };

  const ref = RollReference.createFromObject(obj);

  expect(ref.id).toBe(obj.id);
  expect(ref.version).toBe(obj.version);
});

test("Throws an error when trying to create a Ref from a wrong object", () => {
  // @ts-ignore
  const obj1 = { aa: "bb" } as { id: string; version: string };
  const obj2 = { id: "aaa" } as { id: string; version: string };

  expect(() => RollReference.createFromObject(obj1)).toThrowError();
  expect(() => RollReference.createFromObject(obj2)).toThrowError();
});
