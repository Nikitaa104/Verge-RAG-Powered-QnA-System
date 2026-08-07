import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'model'], required: true },
  content: { type: String, required: true },
});

const conversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

// Indexes for fast lookup
conversationSchema.index({ user: 1 });
conversationSchema.index({ documentId: 1 });

export default mongoose.model('Conversation', conversationSchema);
