import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  code?: string;
  meta?: any;
  statusCode?: number;
  status?: number;
  details?: any;
}

/**
 * Global error handler middleware
 */
export default function errorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error occurred:', err);

  // Default error response
  let statusCode = 500;
  let errorResponse: any = {
    success: false,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  };

  // Handle Prisma errors
  if (err.code) {
    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        errorResponse = {
          success: false,
          error: 'Conflict',
          message: 'A record with this data already exists',
          details: err.meta
        };
        break;
      case 'P2025':
        statusCode = 404;
        errorResponse = {
          success: false,
          error: 'Not Found',
          message: 'The requested record was not found',
          details: err.meta
        };
        break;
      case 'P2003':
        statusCode = 400;
        errorResponse = {
          success: false,
          error: 'Foreign Key Constraint',
          message: 'Foreign key constraint failed',
          details: err.meta
        };
        break;
      case 'P2014':
        statusCode = 400;
        errorResponse = {
          success: false,
          error: 'Invalid ID',
          message: 'The ID provided is invalid',
          details: err.meta
        };
        break;
      default:
        statusCode = 500;
        errorResponse = {
          success: false,
          error: 'Database Error',
          message: 'A database error occurred',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        };
    }
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errorResponse = {
      success: false,
      error: 'Validation Error',
      message: 'The request contains invalid data',
      details: err.details || err.message
    };
  }

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    errorResponse = {
      success: false,
      error: 'Invalid JSON',
      message: 'The request body contains invalid JSON'
    };
  }

  // Handle custom errors
  if (err.statusCode) {
    statusCode = err.statusCode;
    errorResponse = {
      success: false,
      error: err.name || 'Error',
      message: err.message
    };
  }

  // Add request details in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.request = {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query
    };
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
}
