import express from 'express';
import { documentQueue } from '../queue/documentQueue.js';

const router = express.Router();

// Real job status endpoint – retrieves BullMQ job information
router.get('/:id', async (req, res) => {
  try {
    const job = await documentQueue.getJob(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    const state = await job.getState();
    const progress = await job.getProgress();
    const failedReason = job.failedReason;
    const attemptsMade = job.attemptsMade;

    res.status(200).json({
      success: true,
      data: {
        jobId: job.id,
        status: state,
        progress,
        attemptsMade,
        failedReason,
      },
    });
  } catch (error) {
    console.error('Error fetching job status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
