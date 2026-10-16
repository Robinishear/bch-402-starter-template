import { createClient } from "redis";
import { envVars } from "../config/env";

type RedisClient = ReturnType<typeof createClient>;

class RedisService {
  private client: RedisClient | null = null;
  private connecting: Promise<void> | null = null;

  async connect(): Promise<void> {
    if (this.client?.isReady) return;

    // prevent multiple connect()'s at once
    if (this.connecting) return this.connecting;

    this.connecting = this.doConnect().finally(() => {
      this.connecting = null;
    });

    return this.connecting;
  }

  private async doConnect(): Promise<void> {
    if (!this.client) {
      this.client = createClient({
        url: envVars.REDIS_URL,
        // If Redis is disconnected, commands will fail immediately instead of being added to a queue.
        disableOfflineQueue: true,
        socket: {
          connectTimeout: 5000,
          reconnectStrategy: (retries: number) => Math.min(retries * 200, 5000),
        },
      });

      this.client.on("error", (error) => {
        console.error("Redis Client Error:", error);
      });
      this.client.on("ready", () => console.log("Redis Client Ready"));
      this.client.on("reconnecting", () =>
        console.log("Redis Client Reconnecting"),
      );
      this.client.on("end", () => console.log("Redis Client Disconnected"));
    }

    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  private ensureConnection(): RedisClient {
    if (!this.client?.isReady) {
      throw new Error("Redis client is not ready.");
    }
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.ensureConnection().get(key);
  }

  /** The value is always stored as JSON (to align with JSON.parse in getOrSet) */
  async set(key: string, value: unknown, ttlInSeconds: number): Promise<void> {
    if (!Number.isInteger(ttlInSeconds) || ttlInSeconds <= 0) {
      throw new Error("TTL must be a positive integer.");
    }

    const stringValue = JSON.stringify(value);

    if (stringValue === undefined) {
      throw new Error("Value cannot be serialized to JSON.");
    }

    await this.ensureConnection().set(key, stringValue, { EX: ttlInSeconds });
  }

  async delete(key: string): Promise<void> {
    await this.ensureConnection().del(key);
  }

  /** Deletes all keys that start with the given prefix (using SCAN, not KEYS) */
  async deleteByPrefix(prefix: string): Promise<number> {
    const client = this.ensureConnection();
    let deleted = 0;

    // Redis v4 returns a single key, while v5 returns an array of keys — both cases are handled.
    for await (const result of client.scanIterator({
      MATCH: `${prefix}*`,
      COUNT: 100,
    })) {
      const keys = (Array.isArray(result) ? result : [result]) as string[];
      if (keys.length > 0) {
        deleted += await client.del(keys);
      }
    }

    return deleted;
  }

  async isAvailable(): Promise<boolean> {
    try {
      return (await this.ensureConnection().ping()) === "PONG";
    } catch {
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client?.isOpen) {
      await this.client.quit();
    }
  }
}

export const redisService = new RedisService();
