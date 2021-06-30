import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { RollsStorage } from "../storage/RollsStorage";
import { RollReference } from "../storage/RollReference";
import { formAPIGatewayProxyResult } from "./formAPIGatewayProxyResult";

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const ref = JSON.parse(event.body!) as RollReference;

  const storage = new RollsStorage();
  const roll = await storage.getRoll(ref);

  if (!roll) {
    return formAPIGatewayProxyResult(404);
  }

  return formAPIGatewayProxyResult(200, roll);
};
