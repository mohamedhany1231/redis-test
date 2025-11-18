import redis from "redis";
const REDIS_SERVICE = "localhost";
const redisClient = await redis
  .createClient({
    url: `redis://${REDIS_SERVICE}:6379`,
  })
  .on("error", (err) => {
    console.log("Redis Client Error", err);
  })
  .connect();

const set = async (key: string, value: unknown, options?: redis.SetOptions) => {
  await redisClient.set(key, JSON.stringify(value), options);
};

const get = async (key: string) => {
  const value = await redisClient.get(key);
  return value ? JSON.parse(value) : null;
};

export default { get, set };
