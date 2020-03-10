import { Response } from 'express';
import HttpStatus from 'http-status-codes';
import { Container } from 'typedi';
import { Logger } from 'winston';
import { isCelebrate } from 'celebrate';
import { ApiError } from '../errors/api-error';

export function handleErrors(error, _req, res: Response, _next) {
  const logger = Container.get<Logger>('logger');
  logger.error('🔥 Error: %o', error);

  let errors = undefined;
  let statusCode = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Server error';

  if (!error) {
    return res.status(statusCode).jsend.error({ message });
  }

  if (error instanceof ApiError) {
    statusCode = error.status;
    message = error.message;
  } else if (isCelebrate(error)) {
    statusCode = HttpStatus.BAD_GATEWAY;
    message = 'Invalid request!';
    errors = error.joi.details.reduce(
      (acc, entry) => ({
        ...acc,
        [entry.context.label]: entry.message,
      }),
      {},
    );
  } else {
    message = 'Server error';
  }

  if (statusCode >= 400 && statusCode <= 499) {
    return res.status(statusCode).jsend.fail({ message, errors });
  }

  return res.status(statusCode).jsend.error({ message });
}
