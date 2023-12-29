/* eslint-disable max-classes-per-file */
import express, { ErrorRequestHandler } from 'express';
import { IgClientError } from 'instagram-private-api';
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
    } else if (err instanceof IgClientError) {
      logger.error(`Error when handling ${req.path} ${err.stack ?? ''}`);
      const message = err.message.split('; ').slice(1).join('; ');
      res.status(400).send({ message });
    } else {
      logger.error(`Error when handling ${req.path} ${err.stack ?? ''}`);
      res.sendStatus(500);
    }
    next();
  });
