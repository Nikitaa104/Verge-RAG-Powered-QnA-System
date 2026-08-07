import redisClient from "../config/redis.js";
import logger from "../utils/logger.js";

class CacheService {
  /**
   * Get value from Redis and parse JSON.
   * @param {string} key
   * @returns {Promise<any|null>}
   */
  static async get(key) {
    const start = Date.now();
    try {
      const raw = await redisClient.get(key);
      const latency = Date.now() - start;
      if (raw !== null) {
        logger.info({event:'Cache HIT', key, latency, userId: key.split(":")[1]}, 'Cache hit');
        return JSON.parse(raw);
      }
      logger.info({event:'Cache MISS', key, latency, userId: key.split(":")[1]}, 'Cache miss');
      return null;
    } catch (err) {
      logger.error({event:'Cache GET error', key, err}, 'Cache get error');
      return null;
    }
  }

  /**
   * Set value in Redis with optional TTL (seconds).
   * @param {string} key
   * @param {any} value
   * @param {number} ttlSeconds
   */
  static async set(key, value, ttlSeconds = parseInt(process.env.CACHE_TTL) || 300) {
    const start = Date.now();
    try {
      const stringified = JSON.stringify(value);
      if (ttlSeconds > 0) {
        await redisClient.setEx(key, ttlSeconds, stringified);
      } else {
        await redisClient.set(key, stringified);
      }
      const latency = Date.now() - start;
      logger.info({event:'Cache SET', key, ttlSeconds, latency, userId: key.split(":")[1]}, 'Cache set');
    } catch (err) {
      logger.error({event:'Cache SET error', key, err}, 'Cache set error');
    }
  }

  static async del(key) {
    const start = Date.now();
    try {
      await redisClient.del(key);
      const latency = Date.now() - start;
      logger.info({event:'Cache DELETE', key, latency, userId: key.split(":")[1]}, 'Cache delete');
    } catch (err) {
      logger.error({event:'Cache DELETE error', key, err}, 'Cache delete error');
    }
  }
}

export default CacheService;