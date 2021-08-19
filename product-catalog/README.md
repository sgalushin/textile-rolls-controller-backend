# Product Catalog

Product Catalog service reads products and characteristics from the corresponding SQS queues, saves them in a DynamoDB table.

While saving a characteristic it tries to convert its TPX color code into RGB by parsing the [Pantone](https://www.pantone.com/uk/en/color-finder) website.

Product Catalog provides a REST API to read:
 - all products;
 - all characteristics for a specific product;
 - a specific combination of a product and a characteristic.

## Idempotency and Out-of-order Events 

Saving a product/characteristic is an idempotent operation. An item is saved only when:

 - there are no previous versions of the item-to-be-saved.
 - there is a previous version of the item-to-be-saved, and the field `previousVersion` of the item-to-be-saved is equal to the field `version` of the item that is currently in the Table.

This allows events to arrive out-of-order, and also allows duplicate events. 


## Product vs Characteristic definition

A product is a generalized description of some entity (like a model of a T-Shirt). Product doesn't depend on or reference another product.

A characteristic is a specification of some specific product (like a combination of size and color). A characteristic always belongs to one product.

An item that is produced and sold is always a combination of a product and a characteristic (it cannot consist of only a product without a characteristic).

## Tips

 - When adding new or renaming existing lambda handlers, don't forget to update `webpack.config.js`!
 