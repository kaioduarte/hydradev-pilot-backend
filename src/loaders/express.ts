import { Application } from 'express';
import 'express-async-errors';
import { errors } from 'celebrate';
import { Logger } from 'winston';
import bodyParser from 'body-parser';
import { Container } from 'typedi';
import jsend from 'jsend';
import config from '@/config';
import routes from '@/api';
import * as middlewares from '@/api/middlewares';

export default async ({ app }: { app: Application }) => {
  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  app.use(require('cors')());
  app.use(require('helmet')());
  app.use(bodyParser.json({ limit: '15mb' }));
  app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));
  app.use(errors());
  // app.use(
  //   fileUpload({
  //     safeFileNames: true,
  //     preserveExtension: true,
  //   }),
  // );
  app.use(jsend.middleware);

  // Load API routes
  app.use(config.api.prefix, await routes());

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });

  app.use(middlewares.handleErrors);

  // error handlers
  app.use((err, req, res, next) => {
    const logger = Container.get<Logger>('logger');
    logger.error('🔥 error: %o', err);

    return res.jsend.error({
      status: err.status || 500,
      message: err.message,
    });
  });
};
