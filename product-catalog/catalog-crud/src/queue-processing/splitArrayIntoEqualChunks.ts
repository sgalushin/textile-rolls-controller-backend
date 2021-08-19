export const splitArrayIntoEqualChunks = (array: Array<any>, chunkSize: number) => {
  if (!array.length) {
    return [[]];
  }
  let receivedArray = [...array];
  const chunks = [];

  while (receivedArray.length) {
    const newChunk = receivedArray.splice(0, chunkSize);
    chunks.push(newChunk);
  }
  return chunks;
};
