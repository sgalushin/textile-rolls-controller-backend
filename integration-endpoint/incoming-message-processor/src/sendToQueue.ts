import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import eventSettings from "./eventSettings";

const sendMessageToQueue = async (eventType: string, payload: any) => {
  const sqs = new SQSClient({
    region: process.env.AWS_REGION,
  });

  await sqs.send(
    new SendMessageCommand({
      QueueUrl: eventSettings[eventType].queue,
      MessageBody: JSON.stringify(payload),
    })
  );
};

export default sendMessageToQueue;
