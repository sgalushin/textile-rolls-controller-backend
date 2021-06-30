import { splitArrayIntoEqualChunks } from "./splitArrayIntoEqualChunks";

test("Returns the same array when array size is less than chunk size", () => {
  const arr = [1, 2, 3];

  expect(splitArrayIntoEqualChunks(arr, 10)).toStrictEqual([arr]);
});

test("Returns the same array when array size is equal to chunk size", () => {
  const arr = [1, 2, 3];
  expect(splitArrayIntoEqualChunks(arr, 3)).toStrictEqual([arr]);
});

test("Returns multiple chunks when array size is less than chunk size", () => {
  const arr = [1, 2, 3];
  expect(splitArrayIntoEqualChunks(arr, 2)).toStrictEqual([[1, 2], [3]]);
});

test("Returns an empty array inside an empty array when a parameter is an empty array", () => {
  expect(splitArrayIntoEqualChunks([], 10)).toStrictEqual([[]]);
});
