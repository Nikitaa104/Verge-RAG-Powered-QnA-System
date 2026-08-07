
import http from 'http';
import mongoose from 'mongoose';
import app from './app.js';
import logger from './utils/logger.js';
import { connection as bullConnection } from './queue/documentQueue.js';

// ---------------------------------------------------------------------------
// Startup – DB & Redis
// ---------------------------------------------------------------------------
const start = async () => {
  try {

    // -----------------------------------------------------------------------
    // HTTP server
    // -----------------------------------------------------------------------
    const server = http.createServer(app);
    const PORT = process.env.PORT || 5000;

    server.listen(PORT, () => {
      logger.info(`🚀 Server listening on port ${PORT}`);
    });

    // -----------------------------------------------------------------------
    // Graceful shutdown helpers
    // -----------------------------------------------------------------------
    const gracefulShutdown = async (signal) => {
      logger.info(`${signal} received – initiating graceful shutdown`);

      // Stop accepting new HTTP connections
      server.close((err) => {
        if (err) logger.error({ err }, 'Error while closing HTTP server');
      });

      // Close MongoDB connection
      try {
        await mongoose.disconnect();
        logger.info('MongoDB connection closed');
      } catch (e) {
        logger.error({ err: e }, 'Error closing MongoDB');
      }

      // Quit Redis client
      try {
        await redisClient.quit();
        logger.info('Redis client disconnected');
      } catch (e) {
        logger.error({ err: e }, 'Error disconnecting Redis');
      }

      // Close BullMQ / ioredis connection (if it exists)
      if (bullConnection && typeof bullConnection.quit === 'function') {
        try {
          await bullConnection.quit();
          logger.info('BullMQ Redis connection closed');
        } catch (e) {
          logger.error({ err: e }, 'Error closing BullMQ connection');
        }
      }

      process.exit(0);
    };

    // -----------------------------------------------------------------------
    // Process signal handlers
    // -----------------------------------------------------------------------
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

    // -----------------------------------------------------------------------
    // Global error handlers
    // -----------------------------------------------------------------------
    process.on('uncaughtException', (err) => {
      logger.error({ err }, 'Uncaught Exception');
      gracefulShutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error({ reason, promise }, 'Unhandled Rejection');
      gracefulShutdown('unhandledRejection');
    });
  } catch (err) {
    // If startup itself fails, log and exit
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }
};

// ---------------------------------------------------------------------------
// Execute startup
// ---------------------------------------------------------------------------
start();
