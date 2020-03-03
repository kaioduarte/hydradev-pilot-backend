import { Container } from 'typedi';
import { Logger } from 'winston';

export class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super();

    const logger = Container.get<Logger>('logger');
    Error.captureStackTrace(this.constructor);
    logger.debug('%O', this);
    this.name = this.constructor.name;
    this.message = message || 'Something went wrong. Please try again.';
    this.status = status || 500;
  }
}
