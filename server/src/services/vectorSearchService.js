// src/services/vectorSearchService.js
import Chunk from '../models/Chunk.js';
import { GoogleGenAI } from '@google/genai';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// Configuration via environment variables with sensible defaults
const VECTOR_SEARCH_INDEX = process.env.VECTOR_SEARCH_INDEX || 'vector_index';
const VECTOR_TOP_K = parseInt(process.env.VECTOR_TOP_K) || 5;
const VECTOR_SCORE_THRESHOLD = parseFloat(process.env.VECTOR_SCORE_THRESHOLD) || 0; // 0 = accept all
const VECTOR_MAX_CONTEXT_CHARS = parseInt(process.env.VECTOR_MAX_CONTEXT_CHARS) || 4000; // max characters for the assembled context

// Re‑use a single GoogleGenAI instance (same as used for embeddings elsewhere)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate an embedding vector for a user question using Gemini.
 * @param {string} question
 * @returns {Promise<number[]>} embedding vector
 */
export async function embedQuery(question) {
  const start = Date.now();
  try {
    const resp = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: question,
    });
    const embedding = resp.embeddings[0].values;
    logger.info({ event: 'EmbeddingGenerated', latencyMs: Date.now() - start }, 'Generated query embedding');
    return embedding;
  } catch (err) {
    logger.error({ event: 'EmbeddingError', err }, 'Failed to generate query embedding');
    const error = new Error('Failed to generate embedding for query');
    error.statusCode = 500;
    throw error;
  }
}

/**
 * Perform Atlas Vector Search against the Chunk collection.
 * Returns an array of { text, score } sorted by descending score.
 * @param {number[]} queryEmbedding
 * @param {string|mongoose.Types.ObjectId} documentId
 * @param {number} [topK]
 * @param {number} [scoreThreshold]
 * @returns {Promise<Array<{text:string, score:number}>>}
 */
export async function searchRelevantChunks(queryEmbedding, documentId, topK = VECTOR_TOP_K, scoreThreshold = VECTOR_SCORE_THRESHOLD) {
  const start = Date.now();
  // Validate documentId
  if (!mongoose.Types.ObjectId.isValid(documentId)) {
    const error = new Error('Invalid document identifier');
    error.statusCode = 400;
    throw error;
  }
  const docObjId = mongoose.Types.ObjectId(documentId);

  try {
    const pipeline = [
      {
        $vectorSearch: {
          index: VECTOR_SEARCH_INDEX,
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: topK * 10, // fetch more candidates for threshold filtering
          limit: topK,
        },
      },
      { $match: { documentId: docObjId } },
      {
        $project: {
          _id: 0,
          text: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
      ...(scoreThreshold > 0 ? [{ $match: { score: { $gte: scoreThreshold } } }] : []),
      { $sort: { score: -1 } },
    ];

    const results = await Chunk.aggregate(pipeline).lean();
    logger.info({ event: 'VectorSearchCompleted', latencyMs: Date.now() - start, retrievedCount: results.length, topK, scoreThreshold }, 'Vector search completed');
    return results;
  } catch (err) {
    // Fallback for environments without Atlas Vector Search support
    logger.warn({ event: 'VectorSearchFallback', err }, 'Vector search failed, falling back to simple find');
    try {
      const fallback = await Chunk.find({ documentId: docObjId })
        .limit(topK)
        .select('text')
        .lean();
      return fallback.map((c) => ({ text: c.text, score: null }));
    } catch (fallbackErr) {
      logger.error({ event: 'VectorSearchError', err: fallbackErr }, 'Vector search and fallback both failed');
      const error = new Error('Vector search failed');
      error.statusCode = 500;
      throw error;
    }
  }
}

/**
 * Build a clean context string from retrieved chunks.
 * - Removes duplicate chunk texts.
 * - Preserves order by descending similarity score.
 * - Truncates to a maximum character length.
 * @param {Array<{text:string, score:number}>} chunks
 * @returns {string} assembled context
 */
export function buildContext(chunks) {
  const seen = new Set();
  const uniqueChunks = [];
  for (const chunk of chunks) {
    if (!seen.has(chunk.text)) {
      seen.add(chunk.text);
      uniqueChunks.push(chunk);
    }
  }
  let context = uniqueChunks.map((c) => c.text).join('\n\n');
  if (context.length > VECTOR_MAX_CONTEXT_CHARS) {
    context = context.slice(0, VECTOR_MAX_CONTEXT_CHARS) + '...';
  }
  return context;
}
