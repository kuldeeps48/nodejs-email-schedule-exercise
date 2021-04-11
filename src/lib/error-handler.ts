import { ValidationError } from 'express-validation';
import { DuplicateError } from './errors';

export function errorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      error: err.message,
    });
  } else if (err instanceof DuplicateError) {
    return res.status(409).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    error: err.message,
  });
}
