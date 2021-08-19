module.exports = {
  entry: {
    createUpdateProduct: "./build/lambda-handlers/sqs-handlers/product-queue-reader.js",
    createUpdateCharacteristic: "./build/lambda-handlers/sqs-handlers/characteristic-queue-reader.js",
    getAllProducts: "./build/lambda-handlers/http-handlers/get-all-products.js",
    getAllCharacteristics: "./build/lambda-handlers/http-handlers/get-all-characteristics.js",
    getSpecificProductAndCharacteristic: "./build/lambda-handlers/http-handlers/get-specific-product-and-characteristic.js",
  },
  target: "node",
  output: {
    library: {
      name: "lambdaHandler",
      type: "umd",
    },
    filename: (pathData, assetInfo) => `${pathData.runtime}/lambda.js`,
  },
};
