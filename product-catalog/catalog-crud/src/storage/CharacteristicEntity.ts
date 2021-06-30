import { Entity, Table } from "dynamodb-toolbox";

export const createCharacteristicEntity = (table: Table) => {
  return new Entity({
    name: "Characteristic",
    attributes: {
      sk: { sortKey: true, prefix: "CHAR#", default: (data: any) => data.id },
      productId: { partitionKey: true, type: "string", prefix: "PRODUCT#" },
      id: ["sk", 0, { required: true, type: "string" }],
      version: { required: true, type: "string" },
      previousVersion: { required: true, type: "string" },
      deletionMark: { required: true, type: "boolean" },
      picture: { type: "map" },
      color: { type: "map" },
      name: { type: "string" },
    },
    table,
  });
};
