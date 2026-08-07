import rateLimit from 'express-rate-limit';
import { CONFIG } from '../config/index.js';
import logger from '../utils/logger.js';

/** Factory to create a rate limiter middleware. Logs each 429 event with request ID. */
const createLimiter = (maxRequests) => {
  return rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const requestId = req.id || 'unknown';
      const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress;
      logger.warn('Rate limit exceeded', { requestId, ip, path: req.originalUrl, method: req.method, limit: maxRequests });
      res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests, please try again later.',
          requestId,
        },
      });
    },
  });
};

export const authLimiter = createLimiter(CONFIG.AUTH_RATE_LIMIT);
export const uploadLimiter = createLimiter(CONFIG.UPLOAD_RATE_LIMIT);
export const chatLimiter = createLimiter(CONFIG.CHAT_RATE_LIMIT);
