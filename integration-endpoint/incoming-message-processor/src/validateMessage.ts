import { Validator } from "jsonschema";

import { ErrorBodyIsNotAJSON, ErrorBodyWasNotVerified, ErrorUnknownEventType } from "./customErrors";
import eventSettings from "./eventSettings";

interface Message {
  eventType: string;
  payload: any;
}

/**
 * Checks that an incoming message is valid: it is of a known type and conforms to a corresponding JSON-schema.
 * If there is a validation error, an error that is a subclass of ErrorWithPredefinedResponse is raised.
 */
export const validateMessage = (incomingMessage: string | null) => {
  let message: Message;

  try {
    message = JSON.parse(incomingMessage!) as Message;
  } catch (e) {
    throw new ErrorBodyIsNotAJSON();
  }

  if (!message) {
    throw new ErrorBodyIsNotAJSON();
  }

  const currentEventSettings = eventSettings[message.eventType];
  if (!currentEventSettings) {
    throw new ErrorUnknownEventType();
  }

  const validator = new Validator();
  const validationResult = validator.validate(message.payload, currentEventSettings.schema);

  if (!validationResult.valid) {
    throw new ErrorBodyWasNotVerified(validationResult.errors.map((e) => e.stack));
  }

  return message;
};
