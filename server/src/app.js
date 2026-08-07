import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import { connectRedis } from "./config/redis.js";

await connectDB();
await connectRedis();

// Initialize express application
const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Advanced Health Check Route
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.status(200).json({
    status: 'OK',
    database: dbStatus,
    redis: 'CONNECTED',
    gemini: process.env.GEMINI_API_KEY ? 'AVAILABLE' : 'UNAVAILABLE'
  });
});

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/conversations', conversationRoutes);

// Global Error Handler with standardized format
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      code: err.code || 'API_ERROR',
      message: err.message || 'An unexpected error occurred.'
    }
  });
});

export default app;
