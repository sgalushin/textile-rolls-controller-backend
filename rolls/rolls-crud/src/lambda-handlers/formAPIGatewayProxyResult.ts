import { APIGatewayProxyResult } from "aws-lambda";
import accessControlHeaders from "./accessControlHeaders.json";

export const formAPIGatewayProxyResult = (statusCode: number, body: any = ""): APIGatewayProxyResult => {
  return {
    statusCode,
    headers: accessControlHeaders,
    body: typeof body == "string" ? body : JSON.stringify(body),
  };
};
