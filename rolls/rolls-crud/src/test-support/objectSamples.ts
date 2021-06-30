import { User } from "../storage/User";
import { CreateRollInput } from "../storage/RollsStorage";

export const userSample1: User = {
  userName: "Hannah",
  usedId: "a619c9a9-9880-4348-8f85-97621dcd47a4",
};

export const product1 = {
  id: "c7c4deb6-3917-11ea-8158-90b11c13856b",
  deletionMark: false,
  previousVersion: "AAAAAAAhnjM=",
  version: "AAAAAAAiNUY=",
  sku: "s983sh-v-223",
  name: "Zim, 223, whitened sorted",
};

export const prod1char1 = {
  deletionMark: false,
  productId: "c7c4deb6-3917-11ea-8158-90b11c13856b",
  color: { pantone: "15-2215", name: "bright-pink 1", id: "10710" },
  previousVersion: "AAAAAAAiSVM=",
  version: "AAAAAAAih/k=",
  id: "8c983650-b8e6-11e9-814d-90b11c13856b",
  name: "10710 bright-pink 1",
};

export const createRollInputSample1: CreateRollInput = {
  product: product1,
  characteristic: prod1char1,
  totalLength: 200,
  previousDepartmentInfo: { "Dyeing line": "akr-200" },
  user: userSample1,
};
