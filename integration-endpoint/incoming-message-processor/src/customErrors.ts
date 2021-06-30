import { APIGatewayProxyResult } from "aws-lambda";

export abstract class ErrorWithPredefinedResponse extends Error {
  abstract response: APIGatewayProxyResult;
}

export class ErrorBodyIsNotAJSON extends ErrorWithPredefinedResponse {
  response: APIGatewayProxyResult = {
    statusCode: 400,
    body: "Body is not a valid JSON",
  };
}

export class ErrorBodyIsNotAValidMessage extends ErrorWithPredefinedResponse {
  response: APIGatewayProxyResult = {
    statusCode: 400,
    body: "Body is not a valid message: must have 'eventType' and 'payload'",
  };
}

export class ErrorUnknownEventType extends ErrorWithPredefinedResponse {
  response: APIGatewayProxyResult = {
    statusCode: 400,
    body: "Unknown event type",
  };
}

export class ErrorBodyWasNotVerified extends ErrorWithPredefinedResponse {
  constructor(errors: string[]) {
    super();
    this.response.body = JSON.stringify(errors);
  }
  response: APIGatewayProxyResult = {
    statusCode: 400,
    body: "",
  };
}
