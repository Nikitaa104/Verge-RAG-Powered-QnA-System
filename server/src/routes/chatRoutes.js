import express from 'express';
import { askQuestion, getConversations } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/ask', protect, askQuestion);
router.get('/:documentId/conversations', protect, getConversations);

export default router;
