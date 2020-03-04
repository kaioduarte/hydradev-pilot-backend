import { Container } from 'typedi';
import { Request } from 'express';
import { Logger } from 'winston';

export function logger(req: Request, _res, next) {
  const logger = Container.get<Logger>('logger');

  logger.info(`🤖 Data received: %o`, {
    method: req.method,
    url: req.url,
    body: req.body,
    query: req.query,
  });

  next();
}
