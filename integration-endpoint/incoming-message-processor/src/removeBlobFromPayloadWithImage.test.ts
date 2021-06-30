import { removeBlobFromPayloadWithImage } from "./removeBlobFromPayloadWithImage";

test("If an object doesn't contain a 'picture' field, return the object unmodified", () => {
  const data = {
    testField: "...",
  };
  expect(removeBlobFromPayloadWithImage(data)).toStrictEqual(data);
});

test("If an object doesn't contain a 'file' field inside a 'picture' field, return the object unmodified", () => {
  const data = {
    picture: {
      name: "...",
    },
  };

  expect(removeBlobFromPayloadWithImage(data)).toStrictEqual(data);
});

test(`If an object contains a 'file' field inside a 'picture' field, return the object without the 'file' field
   and move the 'hash' filed from 'file' to 'picture'`, () => {
  const data = {
    picture: {
      name: "...",
      file: {
        hash: "ABC",
        blob: "/A*98.gu98",
        otherField: "...",
      },
    },
    otherFieldInData: "...",
  };

  const returnedData = removeBlobFromPayloadWithImage(data);
  expect(returnedData).not.toHaveProperty("picture.file");
  expect(returnedData).toHaveProperty("picture.hash");
  expect(returnedData["picture"]["hash"]).toBe("ABC");

  // but other fields should be left as they were
  expect(returnedData).toHaveProperty("picture.name");
  expect(returnedData).toHaveProperty("otherFieldInData");
});
