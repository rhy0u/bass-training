import { Redis as UpstashRedis } from "@upstash/redis";
import IORedis from "ioredis";

interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, opts?: { ex?: number }): Promise<unknown>;
  del(key: string): Promise<unknown>;
}

function createRedisClient(): RedisClient {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    return new UpstashRedis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }

  const ioredis = new IORedis(process.env.REDIS_URL || "redis://localhost:6379");
  return {
    get: (key) => ioredis.get(key),
    set: (key, value, opts) =>
      opts?.ex ? ioredis.set(key, value, "EX", opts.ex) : ioredis.set(key, value),
    del: (key) => ioredis.del(key),
  };
}

export const redis = createRedisClient();
