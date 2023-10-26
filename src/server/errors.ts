/* eslint-disable max-classes-per-file */
import express, { ErrorRequestHandler } from 'express';
import logger from './logger';

export class ClientError extends Error {
  public status = 400;
}

export class BadRequestError extends ClientError {
  public status = 400;

  message = 'Bad Request';
}

export class UnauthorizedError extends ClientError {
  public status = 401;

  message = 'Unauthorized';
}

export class ForbiddenError extends ClientError {
  public status = 403;

  message = 'Forbidden';
}

export class NotFoundError extends ClientError {
  public status = 404;

  message = 'Not Found';
}

export class ConflictError extends ClientError {
  public status = 409;

  message = 'Conflict';
}

export const errorHandler: ErrorRequestHandler = (
  (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ClientError) {
      res.status(err.status).send({ message: err.message });
    } else {
      logger.error(`Error when handling ${req.path} ${err.stack ?? ''}`);
      res.sendStatus(500);
    }
    next();
  });
