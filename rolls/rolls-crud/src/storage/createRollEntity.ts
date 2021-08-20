import { Entity, Table } from "dynamodb-toolbox";

export const createRollEntity = (table: Table) => {
  return new Entity({
    name: "Roll",
    attributes: {
      id: ["gs1sk", 0, { partitionKey: true, type: "string" }],
      version: ["gs1sk", 1, { sortKey: true, type: "string" }],
      previousVersion: { required: false, type: "string" },
      product: { required: true, type: "map" },
      characteristic: { required: true, type: "map" },
      user: { required: true, type: "map" },
      previousDepartmentInfo: { required: true, type: "map" },
      registrationDate: { required: true, type: "string" },
      physicalId: { partitionKey: "gs1", required: false, type: "string" },
      deletionMark: { required: true, type: "boolean" },
      quality: { required: false, type: "map" },
      totalLength: { required: true, type: "number" },
      firstClassLength: { required: false, type: "number" },
      parentRoll: { required: false, type: "map" },
      gs1sk: { sortKey: "gs1", type: "string" },
      gs2pk: { partitionKey: "gs2", default: (data: any) => truncateDate(data.registrationDate) },
      gs2sk: { sortKey: "gs2", type: "string", default: (data: any) => data.version },
    },

    table,
  });
};

/**
 * Returns a string containing first 10 characters of a string-encoded date,
 * that correspond to a combination of year, month and day (ie. without time).
 * Can be used for grouping items by date
 * @param UTCDateString - ISO 8601 date
 */
export const truncateDate = (UTCDateString: string) => {
  if (UTCDateString.length != 24) {
    throw new Error("Incorrect date - expected UTC string");
  }
  return UTCDateString.slice(0, 10);
};
