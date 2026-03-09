import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockIORedisInstance = {
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
};

vi.mock("@upstash/redis", () => ({
  Redis: class MockUpstash {
    _type = "upstash";
    url: string;
    token: string;
    constructor(opts: { url: string; token: string }) {
      this.url = opts.url;
      this.token = opts.token;
    }
  },
}));

vi.mock("ioredis", () => {
  return {
    default: class MockIORedis {
      _url: string;
      get: typeof mockIORedisInstance.get;
      set: typeof mockIORedisInstance.set;
      del: typeof mockIORedisInstance.del;
      constructor(url: string) {
        this._url = url;
        this.get = mockIORedisInstance.get;
        this.set = mockIORedisInstance.set;
        this.del = mockIORedisInstance.del;
      }
    },
  };
});

describe("redis", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("uses Upstash when UPSTASH_REDIS_REST_URL is set", async () => {
    process.env.UPSTASH_REDIS_REST_URL = "https://upstash.example.com";
    process.env.UPSTASH_REDIS_REST_TOKEN = "token123";

    const mod = await import("@/lib/redis");
    expect(mod.redis).toHaveProperty("_type", "upstash");
  });

  it("uses IORedis when UPSTASH_REDIS_REST_URL is not set", async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    process.env.REDIS_URL = "redis://localhost:6380";

    const mod = await import("@/lib/redis");

    mockIORedisInstance.get.mockResolvedValue("value");
    const getResult = await mod.redis.get("key");
    expect(getResult).toBe("value");

    await mod.redis.set("key", "value", { ex: 60 });
    expect(mockIORedisInstance.set).toHaveBeenCalledWith("key", "value", "EX", 60);

    mockIORedisInstance.set.mockClear();
    await mod.redis.set("key", "value");
    expect(mockIORedisInstance.set).toHaveBeenCalledWith("key", "value");

    await mod.redis.del("key");
    expect(mockIORedisInstance.del).toHaveBeenCalledWith("key");
  });

  it("defaults REDIS_URL to localhost when not set", async () => {
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.REDIS_URL;

    const mod = await import("@/lib/redis");
    expect(mod.redis).toBeDefined();
    expect(mod.redis.get).toBeDefined();
    expect(mod.redis.set).toBeDefined();
    expect(mod.redis.del).toBeDefined();
  });
});
