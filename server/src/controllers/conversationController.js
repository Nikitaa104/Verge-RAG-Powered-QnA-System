import Conversation from '../models/Conversation.js';

export const getConversations = async (req, res, next) => {
  try {
    const query = { user: req.user._id };
    if (req.query.documentId) {
      query.document = req.query.documentId;
    }
    
    const conversations = await Conversation.find(query).sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      message: 'Conversations fetched successfully',
      data: { conversations }
    });
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req, res, next) => {
  try {
    const { title, docId } = req.body;
    
    const newConv = await Conversation.create({
      user: req.user._id,
      document: docId || null,
      title: title || 'New Conversation',
      messages: []
    });

    res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      data: { conversation: newConv }
    });
  } catch (error) {
    next(error);
  }
};

export const getConversation = async (req, res, next) => {
  try {
    const conv = await Conversation.findOne({ _id: req.params.id, user: req.user._id });
    if (!conv) {
      const error = new Error('Conversation not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: 'Conversation fetched successfully',
      data: { conversation: conv }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteConversation = async (req, res, next) => {
  try {
    const conv = await Conversation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!conv) {
      const error = new Error('Conversation not found');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
