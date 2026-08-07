import Joi from 'joi';

export const askQuestionSchema = Joi.object({
  documentId: Joi.string().required(),
  question: Joi.string().required(),
  conversationId: Joi.string().optional()
});
