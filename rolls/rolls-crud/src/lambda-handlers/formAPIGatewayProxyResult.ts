import { APIGatewayProxyResult } from "aws-lambda";
import accessControlHeaders from "./accessControlHeaders.json";

/**
 * An utility function that simplifies the instantiation of APIGatewayProxyResult.
 * To be used in lambda functions triggered by API Gateway.
 */
export const formAPIGatewayProxyResult = (statusCode: number, body: any = ""): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: accessControlHeaders,
    body: typeof body == "string" ? body : JSON.stringify(body),
  };
};
