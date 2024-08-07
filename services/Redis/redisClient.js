import { createClient } from "redis";

let redisClient;

function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({url:process.env.redisUrl});
    redisClient.on("error", (err) => console.error("Redis Client Error", err));
    redisClient.connect().catch(console.error);
  }
  return redisClient;
}

export default getRedisClient;
