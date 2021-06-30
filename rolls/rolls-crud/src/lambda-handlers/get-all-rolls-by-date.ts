import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { RollsStorage } from "../storage/RollsStorage";
import { formAPIGatewayProxyResult } from "./formAPIGatewayProxyResult";

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { date } = JSON.parse(event.body!) as { date: string };

  const storage = new RollsStorage();
  const rolls = await storage.getAllRollsByDate(new Date(Date.parse(date)));

  return formAPIGatewayProxyResult(200, rolls);
};
