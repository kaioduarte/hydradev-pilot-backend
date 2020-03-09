import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import * as middlewares from '@/api/middlewares';
import { celebrate, Joi } from 'celebrate';
import CollectionService from '@/services/collection.service';

const route = Router();

export default (app: Router) => {
  const routeName = '/collections';
  const collectionService = Container.get(CollectionService);

  app.use(routeName, route);

  route.get(
    '/',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    celebrate({
      query: Joi.object({
        name: Joi.string()
          .empty('')
          .default(''),
      }),
    }),
    async (req: Request, res: Response) => {
      const collections = await collectionService.findAll(req.query.name);
      return res.status(HttpStatus.OK).jsend.success({ collections });
    },
  );

  return { route, routeName };
};
