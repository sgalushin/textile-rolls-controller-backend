import KSUID from "ksuid";

export class RollReference {
  readonly id: string;
  readonly version: string;

  protected static createNewVersion = async (): Promise<string> => {
    const timestamp = new Date().toISOString();
    const randomString = (await KSUID.random()).string.slice(24);
    return timestamp + randomString;
  };

  protected static createNewId = async (): Promise<string> => (await KSUID.random()).string;

  protected constructor(id: string, version: string) {
    this.id = id;
    this.version = version;
  }

  static async createRandom(): Promise<RollReference> {
    const id = await RollReference.createNewId();
    const version = await RollReference.createNewVersion();
    return new RollReference(id, version);
  }

  async createNewVersion(): Promise<RollReference> {
    return new RollReference(this.id, await RollReference.createNewVersion());
  }

  static createFromObject({ id, version }: { id: string; version: string }): RollReference {
    if (!(id && version)) {
      throw new Error("Object is not suitable for creating a Ref");
    }
    return new RollReference(id, version);
  }
}
