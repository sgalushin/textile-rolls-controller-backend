import PRODUCT_CHARACTERISTIC_UPDATED from "./event-schemas/PRODUCT_CHARACTERISTIC_UPDATED.json";
import PRODUCT_UPDATED from "./event-schemas/PRODUCT_UPDATED.json";
import { removeBlobFromPayloadWithImage } from "./removeBlobFromPayloadWithImage";
import { saveImageIfNotAlreadyExists } from "./saveImage";

interface EventSettings {
  [key: string]: {
    queue: string;
    schema: object;
    runBeforeSendingToQueue?: (payload: object) => void;
  };
}

/**
 * A static singleton object with keys corresponding to event types and values holding corresponding SQS Queues
 * and JSON Schemas
 */
const eventSettings: EventSettings = {
  PRODUCT_UPDATED: {
    queue: process.env.PRODUCT_UPDATE_QUEUE!,
    schema: PRODUCT_UPDATED,
  },

  PRODUCT_CHARACTERISTICS_UPDATED: {
    queue: process.env.CHARACTERISTIC_UPDATE_QUEUE!,
    schema: PRODUCT_CHARACTERISTIC_UPDATED,
    runBeforeSendingToQueue: async (payload) => {
      await saveImageIfNotAlreadyExists(payload);
      removeBlobFromPayloadWithImage(payload);
    },
  },
};

export default eventSettings;
