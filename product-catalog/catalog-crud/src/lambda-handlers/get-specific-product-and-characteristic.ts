import lambda, { APIGatewayProxyResult } from "aws-lambda";
import { ProductStorage } from "../storage/ProductStorage";

export const lambdaHandler = async (event: lambda.APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const productId = event.pathParameters!["productId"]!;
  const characteristicId = event.pathParameters!["characteristicId"]!;
  const storage = new ProductStorage();
  const product = await storage.getProduct(productId);
  const characteristic = await storage.getCharacacteristic(productId, characteristicId);
  const result = {
    product,
    characteristic,
  };
  if (product && characteristic) {
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } else {
    return {
      statusCode: 404,
      body: "",
    };
  }
};
