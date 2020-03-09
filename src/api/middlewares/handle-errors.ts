import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { Container } from 'typedi';
import { Logger } from 'winston';

export function handleErrors(error, _req, res: Response, _next) {
  const logger = Container.get<Logger>('logger');
  logger.error('🔥 Error: %o', error);

  let statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Server error';

  if (!error) {
    return res.status(statusCode).jsend.error({ message });
  }

  switch (error.name) {
    case 'ApiError':
      statusCode = error.status;
      message = error.message;
      break;
    default:
      message = 'Server error';
      break;
  }

  if (statusCode >= 400 && statusCode <= 499) {
    return res.status(statusCode).jsend.fail({ message });
  }

  return res.status(statusCode).jsend.error({ message });
}
