import { createClient } from "redis";

let redisClient;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.redisUrl,
      socket: {
        tls: true,
        rejectUnauthorized: false, // Only use this option if your certificate is self-signed
      },
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error:", err);
    });

    try {
      await redisClient.connect();
    } catch (err) {
      console.error("Redis connection failed:", err);
    }
  }
  return redisClient;
}


export default getRedisClient;
