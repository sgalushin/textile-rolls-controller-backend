/*
 * Removes the 'file' section with a base64 blob (inside 'picture' field) from an object, retaining a 'hash' field
 * Currently is applicable for PRODUCT_CHARACTERISTIC_UPDATED event only.
 *
 * We need to remove the blob so that the message will fit into the SQS limit.
 * Before calling this function the blob should be saved elsewhere, if needed.
 *
 * @param data The payload of an incoming message
 * @returns Modified payload
 */
export const removeBlobFromPayloadWithImage = (data: any) => {
  const newData = Object.assign({}, data);
  const hash = newData.picture?.file?.hash;
  if (hash) {
    delete newData.picture.file;
    newData.picture.hash = hash;
  }
  return newData;
};
