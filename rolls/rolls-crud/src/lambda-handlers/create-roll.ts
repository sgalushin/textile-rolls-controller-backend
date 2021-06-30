import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { RollsStorage } from "../storage/RollsStorage";
import { formAPIGatewayProxyResult } from "./formAPIGatewayProxyResult";

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const storage = new RollsStorage();
  const ref = await storage.createRoll(JSON.parse(event.body!));
  return formAPIGatewayProxyResult(200, ref);
};
