import { ValidationError } from 'express-validation';
import { NextFunction, Request, Response } from 'express';
import { DuplicateError } from './errors';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): any {
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
