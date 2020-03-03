import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { Router } from 'express';
import Container from 'typedi';
import { Logger } from 'winston';
import config from '@/config';

export default async () => {
  const app = Router();
  const logger = Container.get<Logger>('logger');
  const readDirAsync = promisify(fs.readdir);

  logger.info('🚦 Registering routes...');

  const files = await readDirAsync(path.join(__dirname, 'routes'));

  files
    .filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
    .forEach(file => {
      const registerRoute = require(path.join(__dirname, 'routes', file))
        .default;
      const { route, routeName } = registerRoute(app) || {};

      route?.stack
        .filter(r => r.route)
        .map(r => r.route)
        .forEach(r => {
          Object.entries(r.methods)
            .filter(([, registered]) => registered)
            .forEach(([name]) => {
              logger.info(
                `\t▶ ${name.toUpperCase()} ${config.api.prefix}${routeName}${
                  r.path
                }`,
              );
            });
        });
    });

  return app;
};
