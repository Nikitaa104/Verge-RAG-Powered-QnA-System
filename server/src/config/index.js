import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
  SIMILARITY_THRESHOLD: parseFloat(process.env.SIMILARITY_THRESHOLD) || 0.75,
  AUTH_RATE_LIMIT: parseInt(process.env.AUTH_RATE_LIMIT, 10) || 10,
  UPLOAD_RATE_LIMIT: parseInt(process.env.UPLOAD_RATE_LIMIT, 10) || 10,
  CHAT_RATE_LIMIT: parseInt(process.env.CHAT_RATE_LIMIT, 10) || 60,
  GEMINI_TIMEOUT_MS: parseInt(process.env.GEMINI_TIMEOUT_MS, 10) || 45000,
  GEMINI_MAX_RETRIES: parseInt(process.env.GEMINI_MAX_RETRIES, 10) || 2,
  RETRY_BACKOFF_BASE_MS: parseInt(process.env.RETRY_BACKOFF_BASE_MS, 10) || 1000,
  RETRY_BACKOFF_MULTIPLIER: parseInt(process.env.RETRY_BACKOFF_MULTIPLIER, 10) || 2,
  REQUEST_ID_HEADER: process.env.REQUEST_ID_HEADER || 'X-Request-ID',
};
