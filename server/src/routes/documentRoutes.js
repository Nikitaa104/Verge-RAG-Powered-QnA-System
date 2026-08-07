import express from 'express';
import { uploadDocument, getUserDocuments, getDocument } from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', protect, upload.single('pdf'), uploadDocument);
router.get('/', protect, getUserDocuments);
router.get('/:id', protect, getDocument);

export default router;
