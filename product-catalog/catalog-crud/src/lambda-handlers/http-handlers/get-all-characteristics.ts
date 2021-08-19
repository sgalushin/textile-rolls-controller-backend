import lambda, { APIGatewayProxyResult } from "aws-lambda";
import { ProductStorage } from "../../storage/ProductStorage";
import accessControlHeaders from "../accessControlHeaders.json";

export const lambdaHandler = async (event: lambda.APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const productId = event.pathParameters!["productId"]!;
  const storage = new ProductStorage();
  return {
    statusCode: 200,
    headers: accessControlHeaders,
    body: JSON.stringify(await storage.getAllCharacteristics(productId)),
  };
};
