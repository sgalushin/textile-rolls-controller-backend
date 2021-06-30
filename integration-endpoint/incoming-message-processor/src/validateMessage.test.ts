import { validateMessage } from "./validateMessage";

test("If message is null, raise an exception", () => {
  expect(() => validateMessage(null)).toThrow();
});

test("If message doesn't have a 'payload' of 'eventType' field, raise an exception", () => {
  const badMessage1 = JSON.stringify({ eventType: "..." });
  expect(() => validateMessage(badMessage1)).toThrow();

  const badMessage2 = JSON.stringify({ payload: "..." });
  expect(() => validateMessage(badMessage2)).toThrow();
});

test("A correct message PRODUCT_UPDATED returns an object with necessary fields", () => {
  const message = JSON.stringify(require("./event-schemas/examples/product4.json"));
  const validatedMessage = validateMessage(message);
  expect(validatedMessage).toHaveProperty("eventType");
  expect(validatedMessage).toHaveProperty("payload");
});

test("An incorrect message PRODUCT_UPDATED raises an exception", () => {
  let sourceMessage = require("./event-schemas/examples/product4.json");
  delete sourceMessage.payload.id;
  const message = JSON.stringify(sourceMessage);
  expect(() => validateMessage(message)).toThrow();
});

test("A correct message PRODUCT_CHARACTERISTIC_UPDATED (with color) returns an object with necessary fields", () => {
  const message = JSON.stringify(require("./event-schemas/examples/product2-char1-color.json"));
  const validatedMessage = validateMessage(message);
  expect(validatedMessage).toHaveProperty("eventType");
  expect(validatedMessage).toHaveProperty("payload");
});

test("A correct message PRODUCT_CHARACTERISTIC_UPDATED (with image) returns an object with necessary fields", () => {
  const message = JSON.stringify(require("./event-schemas/examples/product1-char1-picture-with-file.json"));
  const validatedMessage = validateMessage(message);
  expect(validatedMessage).toHaveProperty("eventType");
  expect(validatedMessage).toHaveProperty("payload");
});
