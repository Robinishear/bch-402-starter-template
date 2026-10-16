// cache.ts
import { redisService } from "./redis";

const JITTER_RATIO = 0.1; // TTL-E ±10% randomness

type ReadResult<T> = { hit: true; value: T } | { hit: false };

// real api use CacheService
class CacheService {
  // Ongoing fetches for the same key (to prevent cache stampede)
  private inFlight = new Map<string, Promise<unknown>>();

  async getOrSet<T>(
    key: string,
    fetchData: () => Promise<T>,
    ttlInSeconds: number,
  ): Promise<T> {
    // If a fetch is already in progress for the same key, wait for that one
    const existing = this.inFlight.get(key);
    if (existing) return existing as Promise<T>;

    const promise = (async (): Promise<T> => {
      try {
        const cached = await this.read<T>(key);
        if (cached.hit) return cached.value;

        const freshData = await fetchData();
        await this.write(key, freshData, ttlInSeconds);
        return freshData;
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  /** Delete a key. If Redis fails, the app's flow will not be disrupted. */
  async invalidate(key: string): Promise<void> {
    try {
      await redisService.delete(key);
    } catch (error) {
      console.error("Cache INVALIDATE error:", error);
    }
  }

  async invalidateMany(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.invalidate(key)));
  }

  /** For example, invalidateByPrefix("students:") */
  async invalidateByPrefix(prefix: string): Promise<void> {
    try {
      await redisService.deleteByPrefix(prefix);
    } catch (error) {
      console.error("Cache INVALIDATE PREFIX error:", error);
    }
  }

  private async read<T>(key: string): Promise<ReadResult<T>> {
    try {
      const cachedData = await redisService.get(key);
      if (cachedData === null) return { hit: false };

      try {
        return { hit: true, value: JSON.parse(cachedData) as T };
      } catch {
        // corrupted data — delete it and treat as a miss
        console.error(`Cache corrupted for key "${key}", removing.`);
        await this.invalidate(key);
        return { hit: false };
      }
    } catch (error) {
      // If Redis is down, fetch from the source
      console.error("Cache GET error:", error);
      return { hit: false };
    }
  }

  private async write(
    key: string,
    value: unknown,
    ttlInSeconds: number,
  ): Promise<void> {
    // null/undefined are not cached
    if (value === undefined || value === null) return;

    try {
      await redisService.set(key, value, this.withJitter(ttlInSeconds));
    } catch (error) {
      // Even if the cache fails, fresh data will be returned.
      console.error("Cache SET error:", error);
    }
  }

  private withJitter(ttl: number): number {
    const delta = ttl * JITTER_RATIO;
    const jittered = ttl + (Math.random() * 2 - 1) * delta;
    return Math.max(1, Math.round(jittered));
  }
}

export const cacheService = new CacheService();
