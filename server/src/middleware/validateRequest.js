import { BadRequest } from '../utils/errors.js'; // optional custom error class

/**
 * Middleware generator for Joi validation.
 * Usage: app.use(validate(schema))
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const details = error.details.map((d) => ({
        field: d.path.join('.'),
        issue: d.message,
      }));
      const messages = error.details.map((d) => d.message).join(', ');
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: messages,
          details,
        },
      });
    }
    next();
  };
};
