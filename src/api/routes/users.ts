import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { celebrate, Joi } from 'celebrate';
import * as middlewares from '@/api/middlewares';
import { ApiError } from '@/api/errors/api-error';
import UserService from '@/services/user.service';
import { ICreateUserDto } from '@/interfaces/dto/create-user.dto';

const route = Router();

export default (app: Router) => {
  const routeName = '/users';
  const userService = Container.get(UserService);

  app.use(routeName, route);

  route.get(
    '/',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.isAdmin,
    celebrate({
      query: Joi.object({
        name: Joi.string()
          .empty('')
          .default(''),
      }),
    }),
    async (req: Request, res: Response) => {
      const users = await userService.findAll(req.query.name);

      return res
        .status(HttpStatus.OK)
        .jsend.success({ total: users.length, users });
    },
  );

  route.get(
    '/:userId',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.checkPermission,
    async (req: Request, res: Response) => {
      const user = await userService.findById(req.params.userId);

      if (!user) {
        throw new ApiError('User not found', HttpStatus.NOT_FOUND);
      }

      return res.status(HttpStatus.OK).jsend.success({ user });
    },
  );

  route.patch(
    '/:userId',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.checkPermission,
    celebrate({
      body: Joi.object({
        name: Joi.string(),
        username: Joi.string(),
        password: Joi.string(),
        role: Joi.string().valid('basic', 'admin'),
      }),
    }),
    async (req: Request, res: Response) => {
      if (!req.body) {
        return res.status(HttpStatus.NO_CONTENT).jsend.success(null);
      }

      await userService.patch(req.params.userId, req.body);
      const user = await userService.findById(req.params.userId);

      return res.status(HttpStatus.OK).jsend.success({ user });
    },
  );

  route.put(
    '/:userId',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.checkPermission,
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        role: Joi.string()
          .valid('basic', 'admin')
          .required(),
      }),
    }),
    async (req: Request, res: Response) => {
      await userService.update(req.params.userId, req.body);
      const user = await userService.findById(req.params.userId);

      return res.status(HttpStatus.OK).jsend.success({ user });
    },
  );

  route.post(
    '/',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.isAdmin,
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
        role: Joi.string().valid('basic', 'admin'),
      }),
    }),
    async (req: Request, res: Response) => {
      const userCreated = await userService.create(req.body as ICreateUserDto);

      return res
        .status(HttpStatus.CREATED)
        .jsend.success({ user: userCreated });
    },
  );

  route.delete(
    '/:userId',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.isAdmin,
    async (req: Request, res: Response) => {
      await userService.delete(req.params.userId);
      return res.status(HttpStatus.NO_CONTENT).jsend.success(null);
    },
  );

  return { route, routeName };
};
