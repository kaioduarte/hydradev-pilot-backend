import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import * as middlewares from '@/api/middlewares';
import { celebrate, Joi } from 'celebrate';
import CollectionService from '@/services/collection.service';
import { joiOptions } from '@/config/celebrate';

const route = Router({ mergeParams: true });

export default (app: Router) => {
  const routeName = '/users/:userId/collections';
  const collectionService = Container.get(CollectionService);

  app.use(routeName, route);

  route.get(
    '/',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.checkPermission,
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
      const collections = await collectionService.findAllByUserId(
        req.user._id.toString(),
        req.query.name,
      );
      return res.status(HttpStatus.OK).jsend.success({ collections });
    },
  );

  route.post(
    '/',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    celebrate(
      {
        body: Joi.object({
          name: Joi.string()
            .required()
            .min(3)
            .max(255),
        }),
      },
      joiOptions,
    ),
    async (req: Request, res: Response) => {
      const collection = await collectionService.create(
        req.body,
        req.user._id.toString(),
      );
      return res.status(HttpStatus.CREATED).jsend.success({ collection });
    },
  );

  route.put(
    '/:id',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.checkPermission,
    celebrate(
      {
        body: Joi.object({
          name: Joi.string().required(),
        }),
      },
      joiOptions,
    ),
    async (req: Request, res: Response) => {
      await collectionService.update(req.params.id, req.body);
      const collection = await collectionService.findById(req.params.id);
      return res.status(HttpStatus.OK).jsend.success({ collection });
    },
  );

  route.delete(
    '/:id',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.checkPermission,
    async (req: Request, res: Response) => {
      await collectionService.delete(req.params.id);
      return res.status(HttpStatus.OK).jsend.success(null);
    },
  );

  route.post(
    '/:id/cards',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.checkPermission,
    celebrate(
      {
        body: Joi.object({
          _id: Joi.string().required(),
        }),
      },
      joiOptions,
    ),
    async (req: Request, res: Response) => {
      await collectionService.addCard(req.params.id, req.body);
      const collection = await collectionService.findById(req.params.id);
      return res.status(HttpStatus.OK).jsend.success({ collection });
    },
  );

  route.delete(
    '/:id/cards/:cardId',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.checkPermission,
    async (req: Request, res: Response) => {
      await collectionService.removeCard(req.params.id, req.params.cardId);
      return res.status(HttpStatus.OK).jsend.success(null);
    },
  );

  return { route, routeName };
};
