import { Entity, Table } from "dynamodb-toolbox";

export const createProductEntity = (table: Table) => {
  return new Entity({
    name: "Product",
    attributes: {
      pk: { partitionKey: true, default: "PRODUCTS" },
      sk: { sortKey: true, default: (data: any) => data.id },
      id: { type: "string" },
      version: { required: true, type: "string" },
      previousVersion: { required: true, type: "string" },
      deletionMark: { required: true, type: "boolean" },
      sku: { type: "string" },
      name: { type: "string" },
    },
    table,
  });
};
