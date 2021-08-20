import { Table, Entity } from "dynamodb-toolbox";
import DynamoDB from "aws-sdk/clients/dynamodb";
import { createCharacteristicEntity } from "./CharacteristicEntity";
import { createProductEntity } from "./ProductEntity";
import { ErrorWritingPreviousVersionNotMatched } from "./ErrorWritingPreviousVersionNotMatched";

/**
 * A helper class that abstracts all operations with database.
 * Saving / reading all product data must be done using this class.
 */
export class ProductStorage {
  protected productsTable: Table;
  protected characteristicEntity: Entity<{}>;
  protected productEntity: Entity<{}>;

  protected projectionAttributesForProduct = ["sku", "version", "deletionMark", "name", "id", "created", "modified"];
  protected projectedAttributesForCharacteristic = ["version", "name", "id", "productId", "deletionMark", "color", "picture"];

  constructor() {
    const documentClient = new DynamoDB.DocumentClient({
      region: process.env.AWS_REGION!,
      endpoint: process.env.DYNAMO_DB_ENDPOINT ?? undefined, // endpoint is NOT undefined only when running local for testing purposes
    });
    this.productsTable = new Table({
      name: process.env.PRODUCT_TABLE!,
      partitionKey: "pk",
      sortKey: "sk",
      DocumentClient: documentClient,
    });

    this.characteristicEntity = createCharacteristicEntity(this.productsTable);
    this.productEntity = createProductEntity(this.productsTable);
  }

  /**
   * Universal function to save any versioned and identifiable DynamoDB entity.
   * Entity will be successfully saved, if:
   *  - there is no existing entity with the same 'id';
   *  - there is an existing entity with the same 'id' and its 'version' is equal
   *    to the new entity's 'previousVersion'.
   * @param entity - Product or Characteristic entity (a member of this class).
   * @param data - an object corresponding to a Product or Characteristic (no checks or validation is performed).
   */
  protected saveEntity = async (entity: Entity<any>, data: any) => {
    const performOperationOnEntityWithConditional = async (operation: "put" | "update", conditions: any) => {
      try {
        await entity[operation](data, {
          conditions: conditions,
        });
        return true;
      } catch (e) {
        if (e.code == "ConditionalCheckFailedException") {
          return false;
        } else {
          throw e;
        }
      }
    };
    const updateToNextVersion = async (): Promise<boolean> => {
      return performOperationOnEntityWithConditional("update", [{ attr: "version", eq: data.previousVersion! }]);
    };

    const putFirstVersion = async (): Promise<boolean> => {
      return performOperationOnEntityWithConditional("put", [
        { exists: false, attr: "pk" },
        { exists: false, attr: "sk" },
      ]);
    };

    const objectWithThisVersionAlreadyExists = async (): Promise<boolean> => {
      const existingData = await entity.get(data);
      return existingData?.Item?.version == data.version;
    };

    // Updating an item is a more frequent operation, so try it first
    const dataSuccessfullyWritten = (await updateToNextVersion()) || (await putFirstVersion());
    if (!dataSuccessfullyWritten) {
      if (!(await objectWithThisVersionAlreadyExists())) {
        // If object already exists, do nothing
        throw new ErrorWritingPreviousVersionNotMatched();
      }
    }
  };

  async saveProduct(productData: any) {
    await this.saveEntity(this.productEntity, productData);
  }

  async saveCharacteristic(characteristicData: object) {
    await this.saveEntity(this.characteristicEntity, characteristicData);
  }

  async getAllProducts() {
    const output = await this.productEntity.query("PRODUCTS", {
      attributes: this.projectionAttributesForProduct,
    });
    return output.Items;
  }

  async getAllCharacteristics(productId: string) {
    const output = await this.characteristicEntity.query(`PRODUCT#${productId}`, {
      attributes: this.projectedAttributesForCharacteristic,
    });
    return output.Items;
  }

  async getProduct(productId: string) {
    const output = await this.productEntity.get({ id: productId });
    return output.Item ? output.Item : null;
  }

  async getCharacacteristic(productId: string, characteristicId: string) {
    const output = await this.characteristicEntity.get({ productId, id: characteristicId });
    return output.Item ? output.Item : null;
  }
}
