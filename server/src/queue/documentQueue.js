import { Queue } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Shared Redis connection for BullMQ
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

// Queue with retry strategy and cleanup options
export const documentQueue = new Queue("document-processing", {
  connection,
  defaultJobOptions: {
    attempts: 3, // retry up to 3 times
    backoff: {
      type: "exponential",
      delay: 5000, // initial delay 5s
    },
    removeOnComplete: true,
    removeOnFail: true,
  },
});

export { connection };
