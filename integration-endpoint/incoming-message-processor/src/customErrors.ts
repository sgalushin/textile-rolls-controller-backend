import { APIGatewayProxyResult } from "aws-lambda";

/**
 * Represents an error that occurred while decoding the received message.
 * Extends standard Error class, but also provides a variable 'response' that is a
 * prefabricated response for AWS Lambda (including status code and response body).
 */
export abstract class ErrorWithPredefinedResponse extends Error {
  public response: APIGatewayProxyResult;

  constructor(errorDescription: string, statusCode = 400) {
    super(errorDescription);
    this.response = {
      statusCode: statusCode,
      body: errorDescription
    }
  }
}

export class ErrorBodyIsNotAJSON extends ErrorWithPredefinedResponse {
  constructor() {
    super("Body is not a valid JSON");
  }
}

export class ErrorUnknownEventType extends ErrorWithPredefinedResponse {
  constructor() {
    super("Unknown event type");
  }
}

export class ErrorBodyWasNotVerified extends ErrorWithPredefinedResponse {
  constructor(errors: string[]) {
    super(JSON.stringify(errors));
  }
}
