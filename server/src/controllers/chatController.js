import Conversation from '../models/Conversation.js';
import Chunk from '../models/Chunk.js';
import Document from '../models/Document.js';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const askQuestion = async (req, res, next) => {
  try {
    const { documentId, question, conversationId } = req.body;

    if (!documentId || !question) {
      const error = new Error('Document ID and question required');
      error.statusCode = 400;
      throw error;
    }

    // Ensure document belongs to user and is ready
    const doc = await Document.findOne({ _id: documentId, user: req.user._id });
    if (!doc || doc.status !== 'READY') {
      const error = new Error('Document not found or not ready');
      error.statusCode = 400;
      throw error;
    }

    // 1. Get embedding for user question
    const queryEmbeddingRes = await ai.models.embedContent({
      model: 'text-embedding-004',
      contents: question,
    });
    const queryEmbedding = queryEmbeddingRes.embeddings[0].values;


    // Load or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, user: req.user._id });
    }
    if (!conversation) {
      conversation = await Conversation.create({ user: req.user._id, documentId, messages: [] });
    }

    // 2. Vector Search (Using Atlas Vector Search if available)
    let relevantChunks = [];
    try {
        relevantChunks = await Chunk.aggregate([
          {
            $vectorSearch: {
              index: 'vector_index',
              path: 'embedding',
              queryVector: queryEmbedding,
              numCandidates: 100,
              limit: 5,
            }
          },
          {
            $match: { documentId: doc._id }
          },
          {
            $project: {
              _id: 0,
              text: 1,
              score: { $meta: 'vectorSearchScore' }
            }
          }
        ]);
    } catch(err) {
        // Fallback for local development without Atlas index
        relevantChunks = await Chunk.find({ documentId: doc._id }).limit(5);
    }

    if (relevantChunks.length === 0) {
       return res.status(200).json({ answer: "I couldn't find this information in the uploaded document." });
    }

    // 3. Construct Prompt
    const contextText = relevantChunks.map(c => c.text).join('\n\n');
    const systemInstruction = `You are an assistant that answers ONLY from the provided context. If the answer cannot be found, say you don't know. Never invent information.\n\nContext:\n${contextText}`;

    if (!conversation) {
      conversation = await Conversation.create({ user: req.user._id, documentId, messages: [] });
    }

    // 4. Set Headers for SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 5. Call Gemini with Streaming
    const chat = ai.chats.create({
        model: 'gemini-1.5-flash',
        config: { systemInstruction }
    });

    const resultStream = await chat.sendMessageStream({ message: question });

    let fullAnswer = '';

    for await (const chunk of resultStream) {
      const textChunk = chunk.text;
      if (textChunk) {
        fullAnswer += textChunk;
        // Write the chunk to the stream
        res.write(`data: ${JSON.stringify({ text: textChunk })}\n\n`);
      }
    }

    // Save history after streaming is fully complete
    conversation.messages.push({ role: 'user', content: question });
    conversation.messages.push({ role: 'model', content: fullAnswer });
    await conversation.save();

    // Signal the end of the stream and send the conversationId
    res.write(`data: ${JSON.stringify({ done: true, conversationId: conversation._id })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Streaming Error:', error);
    if (!res.headersSent) {
      next(error);
    } else {
      res.write(`data: ${JSON.stringify({ error: 'An error occurred during streaming.' })}\n\n`);
      res.end();
    }
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    const conversations = await Conversation.find({ documentId, user: req.user._id }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, conversations });
  } catch (error) {
    next(error);
  }
};
