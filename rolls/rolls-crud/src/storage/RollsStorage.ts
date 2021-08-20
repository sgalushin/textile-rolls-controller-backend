import KSUID from "ksuid";
import { Entity, Table } from "dynamodb-toolbox";
import { createRollEntity, truncateDate } from "./createRollEntity";
import { User } from "./User";
import { RollReference } from "./RollReference";
import { createRollsTableDefinition } from "./createRollsTableDefinition";

export interface CreateRollInput {
  product: object;
  characteristic: object;
  user: User;
  previousDepartmentInfo: any;
  totalLength: number;
}

export interface createDescendantRollInput {
  parentRef: RollReference;
  newRef?: RollReference;
  user: User;
  totalLength: number;
  firstClassLength: number;
  quality: object;
}

export interface UpdateRollInput {
  ref: RollReference;
  product?: string;
  characteristic?: string;
  user: User;
  previousDepartmentInfo?: any;
  deletionMark?: boolean;
  totalLength?: number;
}

const conditionPkSkExists = [
  { exists: false, attr: "pk" },
  { exists: false, attr: "sk" },
];

/**
 * A helper class that abstracts all operations with database.
 * Saving / reading all roll data must be done using this class.
 * Detailed explanation of terminology and roll operations is in rolls/README.md
 */
export class RollsStorage {
  protected rollsTable: Table;
  protected rollEntity: Entity<{}>;

  constructor() {
    this.rollsTable = createRollsTableDefinition();
    this.rollEntity = createRollEntity(this.rollsTable);
  }

  async createRoll(input: CreateRollInput): Promise<RollReference> {
    const newRef = await RollReference.createRandom();
    const res = await this.rollEntity.put(
      {
        id: newRef.id,
        version: newRef.version,
        product: input.product,
        characteristic: input.characteristic,
        user: input.user,
        previousDepartmentInfo: input.previousDepartmentInfo,
        registrationDate: new Date().toISOString(),
        physicalId: KSUID.randomSync().string,
        deletionMark: false,
        totalLength: input.totalLength,
      },
      {
        conditions: [...conditionPkSkExists],
      }
    );
    return newRef;
  }

  async updateRoll(input: UpdateRollInput): Promise<RollReference> {
    input.ref = RollReference.createFromObject(input.ref);
    const existing = await this.getLatestRoll(input.ref.id);
    if (existing.version != input.ref.version) {
      throw new Error("Updating a version that is not the latest is not possible");
    }
    const newRef = await input.ref.createNewVersion();
    await this.rollEntity.put(
      {
        id: newRef.id,
        version: newRef.version,
        previousVersion: input.ref.version,
        product: input.product ? input.product : existing.product,
        characteristic: input.characteristic ? await input.characteristic : existing.characteristic,
        user: input.user,
        previousDepartmentInfo: input.previousDepartmentInfo ? input.previousDepartmentInfo : existing.previousDepartmentInfo,
        registrationDate: existing.registrationDate,
        physicalId: existing.physicalId,
        deletionMark: input.deletionMark ? input.deletionMark : existing.deletionMark,
        quality: existing.quality,
        parentRoll: existing.parentRoll,
        totalLength: input.totalLength ? input.totalLength : existing.totalLength,
      },
      {
        conditions: [...conditionPkSkExists],
      }
    );
    return newRef;
  }

  async createDescendantRoll(input: createDescendantRollInput): Promise<RollReference> {
    input.parentRef = RollReference.createFromObject(input.parentRef);
    const parent = await this.getLatestRoll(input.parentRef.id);
    if (parent.version != input.parentRef.version) {
      throw new Error("Updating a version that is not the latest is not possible");
    }
    const newRef = input.newRef ?? (await RollReference.createRandom());

    await this.rollEntity.put(
      {
        id: newRef.id,
        version: newRef.version,
        product: parent.product,
        characteristic: parent.characteristic,
        user: input.user,
        previousDepartmentInfo: parent.previousDepartmentInfo,
        registrationDate: parent.registrationDate,
        physicalId: parent.physicalId,
        deletionMark: false,
        quality: input.quality,
        totalLength: input.totalLength,
        firstClassLength: input.firstClassLength,
        parentRoll: input.parentRef,
      },
      {
        conditions: [...conditionPkSkExists],
      }
    );

    return newRef;
  }

  async getRoll(ref: RollReference) {
    const response = await this.rollEntity.get(ref);
    return response.Item ?? null;
  }

  async getLatestRoll(id: string) {
    const results = await this.rollEntity.query(id, { reverse: true, limit: 1, consistent: true });
    if (results.Count == 0) {
      throw new Error("Roll not found");
    }

    return results.Items[0];
  }

  async getAllRollsByDate(date: Date) {
    const pk = truncateDate(date.toISOString());
    const results = await this.rollEntity.query(pk, {
      index: "gs2",
    });
    return results;
  }

  async getAllRollsByPhysicalId(physicalId: string) {
    const results = await this.rollEntity.query(physicalId, {
      index: "gs1",
    });

    return results;
  }
}
