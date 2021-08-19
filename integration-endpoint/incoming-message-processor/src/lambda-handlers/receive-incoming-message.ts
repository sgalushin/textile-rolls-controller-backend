import lambda, { APIGatewayProxyResult } from "aws-lambda";
import { validateMessage } from "../validateMessage";
import sendMessageToQueue from "../sendToQueue";
import { ErrorWithPredefinedResponse } from "../customErrors";
import eventSettings from "../eventSettings";

/**
 * A lambda handler for receiving any type of message.
 * If a message is successfully received, returns an empty 202 response.
 * If while processing a message a known type of error was encountered, returns 400 response with error description.
 * If an unknown error was encountered, the Error is propagated and lambda function fallbacks on default AWS behaviour.
 */
export const lambdaHandler = async (event: lambda.APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { eventType, payload } = validateMessage(event.body);
    eventSettings[eventType].runBeforeSendingToQueue?.call(null, payload);
    await sendMessageToQueue(eventType, payload);

    return {
      statusCode: 202,
      body: "",
    };
  } catch (e) {
    if (e instanceof ErrorWithPredefinedResponse) {
      return e.response;
    } else {
      throw e;
    }
  }
};
