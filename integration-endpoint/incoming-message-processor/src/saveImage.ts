import { PutObjectCommand, PutObjectCommandInput, ListObjectsV2Command, S3Client, S3 } from "@aws-sdk/client-s3";

interface saveParams {
  s3client: S3Client;
  bucket: string;
  objName: string;
  base64blob: string;
}

/*
 * Saves an image from the 'picture/file/blob' field in payload to S3.
 * If image with such hash already exists in a bucket, does nothing.
 *
 * @returns True when image was saved to S3. False when image already existed on S3.
 */
export const saveImageIfNotAlreadyExists = async (payload: any): Promise<boolean> => {
  const file = payload.picture?.file;
  if (!(file && file.blob && file.hash)) {
    return new Promise((resolve, reject) => {
      setImmediate(() => resolve(false));
    });
  }

  const params: saveParams = {
    s3client: new S3Client({
      region: process.env.AWS_REGION,
    }),
    bucket: process.env.PRODUCT_IMAGES_BUCKET!,
    objName: `${file.hash}.jpg`,
    base64blob: file.blob,
  };

  if (!(await objectExists(params))) {
    await uploadObject(params);
    return true;
  }

  return false;
};

const objectExists = async ({ s3client, bucket, objName }: saveParams) => {
  const listExistingCommand = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: objName,
  });

  const resp = await s3client.send(listExistingCommand);
  return resp.KeyCount ?? 0 > 0;
};

const uploadObject = async ({ s3client, bucket, objName, base64blob }: saveParams) => {
  const uploadParams: PutObjectCommandInput = {
    Bucket: bucket,
    Key: objName,
    Body: Buffer.from(base64blob, "base64"),
  };

  await s3client.send(new PutObjectCommand(uploadParams));
};
