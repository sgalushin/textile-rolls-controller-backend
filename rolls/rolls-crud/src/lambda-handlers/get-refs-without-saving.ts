import { APIGatewayEvent, APIGatewayProxyResult } from "aws-lambda";
import { RollReference } from "../storage/RollReference";
import { formAPIGatewayProxyResult } from "./formAPIGatewayProxyResult";

export const lambdaHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const numberOfRefs = JSON.parse(event.body!).numberOfRefs;

  if (numberOfRefs < 1) {
    return formAPIGatewayProxyResult(400);
  }

  const refsPromises = Array(numberOfRefs)
    .fill(undefined)
    .map(async () => await RollReference.createRandom());

  const refs = await Promise.all(refsPromises);

  return formAPIGatewayProxyResult(200, refs);
};
