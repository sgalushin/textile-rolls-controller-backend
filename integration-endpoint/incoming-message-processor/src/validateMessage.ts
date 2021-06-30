import { Validator } from "jsonschema";

import { ErrorBodyIsNotAJSON, ErrorBodyWasNotVerified, ErrorUnknownEventType } from "./customErrors";
import eventSettings from "./eventSettings";

interface Message {
  eventType: string;
  payload: any;
}

export const validateMessage = (incomingMessage: string | null) => {
  let message: Message;

  try {
    message = JSON.parse(incomingMessage!) as Message;
  } catch (e) {
    throw new ErrorBodyIsNotAJSON();
  }

  if (!message || message == null) {
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
