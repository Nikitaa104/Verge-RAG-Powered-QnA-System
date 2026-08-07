import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    hash: { type: String },
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'READY', 'ERROR'],
      default: 'PENDING',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    error: { type: String },
  },
  { timestamps: true }
);

// Indexes for efficient queries and duplicate detection
documentSchema.index({ user: 1 });
documentSchema.index({ status: 1 });
// Composite index to prevent same user uploading identical file (hash)
documentSchema.index({ user: 1, hash: 1 }, { unique: true, sparse: true });

export default mongoose.model('Document', documentSchema);
