import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import * as middlewares from '@/api/middlewares';
import { celebrate, Joi } from 'celebrate';
import CardService from '@/services/card.service';

const route = Router();

export default (app: Router) => {
  const routeName = '/cards';
  const cardService = Container.get(CardService);

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
      const cards = await cardService.findAll(req.query.name);
      return res.status(HttpStatus.OK).jsend.success({ cards });
    },
  );

  return { route, routeName };
};
