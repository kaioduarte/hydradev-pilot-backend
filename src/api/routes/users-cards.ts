import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import * as middlewares from '@/api/middlewares';
import { celebrate, Joi } from 'celebrate';
import Card from '@/services/card.service';
import { ICreateCardDto } from '@/interfaces/dto/create-card.dto';
import { joiOptions } from '@/config/celebrate';

const route = Router({ mergeParams: true });

export default (app: Router) => {
  const routeName = '/users/:userId/cards';
  const cardService = Container.get(Card);

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
      const cards = await cardService.findAll(req.query.name);
      return res.status(HttpStatus.OK).jsend.success({ cards });
    },
  );

  route.get(
    '/:id',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response) => {
      const card = await cardService.findById(req.params.id);
      return res.status(HttpStatus.OK).jsend.success({ card });
    },
  );

  route.post(
    '/',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    celebrate(
      {
        body: Joi.object({
          mana: Joi.number().required(),
          name: Joi.string().required(),
          description: Joi.string().empty(),
          type: Joi.string().valid(
            'creature',
            'sorcery',
            'instant',
            'artifact',
            'land',
          ),
          attack: Joi.when('type', {
            is: Joi.string()
              .valid('creature')
              .required(),
            then: Joi.number().required(),
          }),
          defense: Joi.when('type', {
            is: Joi.string()
              .valid('creature')
              .required(),
            then: Joi.number().required(),
          }),
        }),
      },
      joiOptions,
    ),
    async (req: Request, res: Response) => {
      const card = await cardService.create(
        req.body as ICreateCardDto,
        req.user._id.toString(),
      );
      return res.status(HttpStatus.CREATED).jsend.success({ card });
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
          image: Joi.binary(),
          mana: Joi.number().required(),
          name: Joi.string().required(),
          description: Joi.string().required(),
          type: Joi.string().valid(
            'creature',
            'sorcery',
            'instant',
            'artifact',
            'land',
          ),
          attack: Joi.when('type', {
            is: Joi.string()
              .valid('creature')
              .required(),
            then: Joi.number().required(),
          }),
          defense: Joi.when('type', {
            is: Joi.string()
              .valid('creature')
              .required(),
            then: Joi.number().required(),
          }),
        }),
      },
      joiOptions,
    ),
    async (req: Request, res: Response) => {
      await cardService.update(req.params.id, req.body);
      const card = await cardService.findById(req.params.id);
      return res.status(HttpStatus.OK).jsend.success({ card });
    },
  );

  route.delete(
    '/:id',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.checkPermission,
    async (req: Request, res: Response) => {
      await cardService.delete(req.params.id);
      return res.status(HttpStatus.NO_CONTENT).jsend.success(null);
    },
  );

  return { route, routeName };
};
