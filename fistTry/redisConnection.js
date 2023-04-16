import { createClient } from "redis";

const redisClient = createClient({
  password: "VemmBbvGPrfaIaNas1FROv1YJtYLSNsI",
  socket: {
    host: "redis-13151.c55.eu-central-1-1.ec2.cloud.redislabs.com",
    port: 13151,
    connectTimeout: 20000,
  },
});
await redisClient.connect();
export const redis = redisClient;
