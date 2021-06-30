import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import { RollsStorage } from "../storage/RollsStorage";
import { formAPIGatewayProxyResult } from "./formAPIGatewayProxyResult";

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const { physicalId } = JSON.parse(event.body!) as { physicalId: string };

  const storage = new RollsStorage();
  const rolls = await storage.getAllRollsByPhysicalId(physicalId);

  return formAPIGatewayProxyResult(200, rolls);
};
