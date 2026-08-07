import crypto from 'crypto';
import fs from 'fs';
import Document from '../models/Document.js';
import { documentQueue } from '../queue/documentQueue.js';

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('No PDF file provided');
      error.statusCode = 400;
      throw error;
    }

    // Compute SHA-256 hash of the uploaded file for duplicate detection
    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Save metadata to MongoDB (including hash) - duplicate detection via unique index on {user, hash}
    const document = await Document.create({
      title: req.body.title || req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      hash,
      user: req.user._id,
      status: 'PENDING',
    });

    // Add job to Redis Queue
    await documentQueue.add('process-pdf', {
      documentId: document._id,
      filename: req.file.filename,
      userId: req.user._id,
    });

    res.status(202).json({
      success: true,
      message: 'Document uploaded and queued for processing',
      document: {
        _id: document._id,
        title: document.title,
        status: document.status,
      },
    });
  } catch (error) {
    // Handle duplicate key error from unique hash+user index
    if (error.code === 11000) {
      const dupError = new Error('Duplicate document upload detected');
      dupError.statusCode = 409;
      return next(dupError);
    }
    next(error);
  }
};

export const getUserDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, documents });
  } catch (error) {
    next(error);
  }
};

export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
    if (!document) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ success: true, document });
  } catch (error) {
    next(error);
  }
};
