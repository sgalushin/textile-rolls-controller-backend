import { lambdaHandler } from "./get-refs-without-saving";
import { APIGatewayEvent } from "aws-lambda";

test("Returns an empty array when the number of references is less than 1 ", async () => {
  const event = {
    body: JSON.stringify({
      numberOfRefs: 0,
    }),
  };

  const response = await lambdaHandler(event as APIGatewayEvent);
  expect(response.statusCode).toBe(400);
});

test("Returns an array of refs", async () => {
  const event = {
    body: JSON.stringify({
      numberOfRefs: 3,
    }),
  };

  const response = await lambdaHandler(event as APIGatewayEvent);
  expect(response.statusCode).toBe(200);
  const refs = JSON.parse(response.body);
  expect(refs.length).toBe(3);
  expect(refs[0].id).not.toBe(refs[1].id);
  for (let ref of refs) {
    expect(ref.id).not.toHaveLength(0);
    expect(ref.version).not.toHaveLength(0);
  }
});
