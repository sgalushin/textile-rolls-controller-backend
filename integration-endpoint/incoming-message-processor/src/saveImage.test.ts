import { saveImageIfNotAlreadyExists } from "./saveImage";
import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

jest.mock("@aws-sdk/client-s3");

const clientS3Mocked = S3Client as jest.MockedClass<typeof S3Client>;

test("If there is no 'picture' tag, do nothing", async () => {
  const payload = { randomTag: "..." };
  expect(await saveImageIfNotAlreadyExists(payload)).toBe(false);
  expect(clientS3Mocked.prototype.send).not.toBeCalled();
});

test("If there is no both 'blob' and 'hash' tags inside a picture/file, do nothing", async () => {
  const payloads = [
    { picture: { randomTag: 0, blob: "..." } },
    {
      picture: {
        file: {
          randomTag: "...",
        },
      },
    },
    {
      picture: {
        file: {
          blob: "...",
        },
      },
    },
    {
      picture: {
        file: {
          hash: "...",
        },
      },
    },
  ];

  for (const payload of payloads) {
    expect(await saveImageIfNotAlreadyExists(payload)).toBe(false);
    expect(clientS3Mocked.prototype.send).not.toBeCalled();
  }
});

test("If there is a 'picture' with 'blob' and 'hash', call S3 at least one time", async () => {
  jest.spyOn(clientS3Mocked.prototype, "send").mockImplementation((command) => {
    if (command instanceof ListObjectsV2Command) {
      return {
        KeyCount: 1,
      };
    }
  });

  const payload = {
    picture: {
      file: {
        blob: "...",
        hash: "...",
      },
    },
  };
  await saveImageIfNotAlreadyExists(payload);
  expect(clientS3Mocked.prototype.send).toBeCalled();
});

test(`If an object with a name '<HASH>.jpg' already exists in a bucket, do nothing`, async () => {
  jest.spyOn(clientS3Mocked.prototype, "send").mockImplementation((command) => {
    if (command instanceof ListObjectsV2Command) {
      return {
        KeyCount: 1,
      };
    }
  });

  const payload = {
    picture: {
      file: {
        blob: "...",
        hash: "...",
      },
    },
  };
  await saveImageIfNotAlreadyExists(payload);

  expect(clientS3Mocked.prototype.send).toBeCalledWith(
    expect.objectContaining({
      constructor: ListObjectsV2Command,
    })
  );

  expect(clientS3Mocked.prototype.send).not.toBeCalledWith(
    expect.objectContaining({
      constructor: PutObjectCommand,
    })
  );
});

test("If there is no object with a name '<HASH>.jpg', upload one from the blob", async () => {
  jest.spyOn(clientS3Mocked.prototype, "send").mockImplementation((command) => {
    if (command instanceof ListObjectsV2Command) {
      return {
        KeyCount: 0,
      };
    }
  });

  const payload = {
    picture: {
      file: {
        blob: "...",
        hash: "...",
      },
    },
  };
  await saveImageIfNotAlreadyExists(payload);

  expect(clientS3Mocked.prototype.send).toBeCalledWith(
    expect.objectContaining({
      constructor: ListObjectsV2Command,
    })
  );

  expect(clientS3Mocked.prototype.send).toBeCalledWith(
    expect.objectContaining({
      constructor: PutObjectCommand,
    })
  );
});
