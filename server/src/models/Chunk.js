import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    text: { type: String, required: true },
    page: { type: Number, required: true },
    embedding: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

// Index for fast lookup by document
chunkSchema.index({ documentId: 1 });

export default mongoose.model('Chunk', chunkSchema);
