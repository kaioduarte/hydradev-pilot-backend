import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import * as middlewares from '@/api/middlewares';
import { celebrate, Joi } from 'celebrate';
import CollectionService from '@/services/collection.service';
import { joiOptions } from '@/config/celebrate';
import { ApiError } from '../errors/api-error';

const route = Router();

export default (app: Router) => {
  const routeName = '/collections';
  const collectionService = Container.get(CollectionService);

  app.use(routeName, route);

  route.get(
    '/',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    celebrate(
      {
        query: Joi.object({
          name: Joi.string()
            .empty('')
            .default(''),
        }),
      },
      joiOptions,
    ),
    async (req: Request, res: Response) => {
      const collections = await (req.user.role === 'admin'
        ? collectionService.findAll(req.query.name)
        : collectionService.findAllByUserId(req.user.id, req.query.name));
      return res.status(HttpStatus.OK).jsend.success({ collections });
    },
  );

  route.get(
    '/:id',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response) => {
      const collection = await collectionService.findById(req.params.id);

      if (collection.user?.id !== req.user.id && req.user.role !== 'admin') {
        throw new ApiError(
          "You don't permission to access this resource",
          HttpStatus.FORBIDDEN,
        );
      }

      return res.status(HttpStatus.OK).jsend.success({ collection });
    },
  );

  return { route, routeName };
};
