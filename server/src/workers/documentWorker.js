import { Worker } from 'bullmq';
import IORedis from "ioredis";
import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';
import Document from '../models/Document.js';
import Chunk from '../models/Chunk.js';
import { connectDB } from '../config/db.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });


const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Step 8: Chunking utility
const chunkText = (text, wordLimit = 500, overlap = 100) => {
  const words = text.split(/\s+/);
  const chunks = [];
  for (let i = 0; i < words.length; i += (wordLimit - overlap)) {
    const chunkWords = words.slice(i, i + wordLimit);
    chunks.push(chunkWords.join(' '));
    if (i + wordLimit >= words.length) break;
  }
  return chunks;
};

// Step 9: Embeddings utility
const getEmbedding = async (text) => {
  const response = await ai.models.embedContent({
    model: 'text-embedding-004',
    contents: text,
  });
  return response.embeddings[0].values;
};

const processDocument = async (job) => {
  const { documentId, filename } = job.data;
  console.log(`Processing document: ${documentId}`);

  try {
    await Document.findByIdAndUpdate(documentId, { status: 'PROCESSING' });

    // Step 7: Parse PDF
    const filePath = path.resolve('uploads', filename);
    const dataBuffer = await fs.readFile(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;
    
    // Step 8: Chunking
    const chunks = chunkText(text, 500, 100);
    console.log(`Document split into ${chunks.length} chunks`);

    // Step 9: Embeddings and Save
    for (let i = 0; i < chunks.length; i++) {
      const chunkTextStr = chunks[i];
      if (chunkTextStr.trim().length === 0) continue;
      
      const embedding = await getEmbedding(chunkTextStr);
      
      await Chunk.create({
        documentId,
        text: chunkTextStr,
        page: 1, // Simplified page tracking for pdf-parse full text
        embedding,
      });
      
      // Update job progress
      await job.updateProgress(Math.floor(((i + 1) / chunks.length) * 100));
    }

    // Mark ready
    await Document.findByIdAndUpdate(documentId, { status: 'READY' });
    console.log(`Document ${documentId} processing complete.`);

  } catch (error) {
    console.error(`Error processing document ${documentId}:`, error);
    await Document.findByIdAndUpdate(documentId, { 
      status: 'ERROR',
      error: error.message 
    });
    throw error;
  }
};

const worker = new Worker(
  "document-processing",
  processDocument,
  {
    connection,
  }
);

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});
