import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { RollsStorage, UpdateRollInput } from "../storage/RollsStorage";
import { formAPIGatewayProxyResult } from "./formAPIGatewayProxyResult";

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const input = JSON.parse(event.body!) as UpdateRollInput;

  const storage = new RollsStorage();
  const ref = await storage.updateRoll(input);

  return formAPIGatewayProxyResult(200, ref);
};
