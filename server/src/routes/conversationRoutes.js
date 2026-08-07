import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  getConversations,
  createConversation,
  getConversation,
  deleteConversation
} from '../controllers/conversationController.js';

const router = express.Router();

router.route('/')
  .get(protect, getConversations)
  .post(protect, createConversation);

router.route('/:id')
  .get(protect, getConversation)
  .delete(protect, deleteConversation);

export default router;
