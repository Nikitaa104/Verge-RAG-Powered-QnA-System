import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.js';
import { CONFIG } from '../config/index.js';

/** Middleware to generate a unique request ID and attach it to request/response */
export const requestIdMiddleware = (req, res, next) => {
  const requestId = uuidv4();
  req.id = requestId;
  res.setHeader(CONFIG.REQUEST_ID_HEADER, requestId);
  // child logger with requestId for downstream log statements
  req.logger = logger.child({ requestId });
  req.logger.info('Incoming request', { method: req.method, url: req.originalUrl });
  next();
};
