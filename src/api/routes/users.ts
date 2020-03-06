import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import HttpStatus from 'http-status-codes';
import { isValidObjectId } from 'mongoose';
import * as middlewares from '@/api/middlewares';
import { ApiError } from '@/api/errors/api-error';
import { celebrate, Joi } from 'celebrate';
import UserService from '@/services/user.service';
import { ICreateUserDto } from '@/interfaces/dto/create-user.dto';

const route = Router();

export default (app: Router) => {
  const routeName = '/users';
  const userService = Container.get(UserService);

  app.use(routeName, route);

  route.get(
    '/me',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    (req: Request, res: Response) => {
      res.status(HttpStatus.OK).jsend.success({ user: req.user });
    },
  );

  route.get(
    '/',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response) => {
      if (req.user?.role !== 'admin') {
        throw new ApiError('You can just see your data', HttpStatus.FORBIDDEN);
      }

      const users = await userService.findAll();

      return res
        .status(HttpStatus.OK)
        .jsend.success({ total: users.length, users });
    },
  );

  route.get(
    '/:id',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    async (req: Request, res: Response) => {
      if (!isValidObjectId(req.params.id)) {
        throw new ApiError('Invalid ObjectId', HttpStatus.BAD_REQUEST);
      }

      if (req.user?._id !== req.params.id && req.user?.role !== 'admin') {
        throw new ApiError('You can just see your data', HttpStatus.FORBIDDEN);
      }

      const user = await userService.findById(req.params.id, '-password');

      if (!user) {
        throw new ApiError('User not found', HttpStatus.NOT_FOUND);
      }

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
    '/:id',
    middlewares.isAuthenticated,
    middlewares.attachCurrentUser,
    middlewares.isAdmin,
    async (req: Request, res: Response) => {
      await userService.delete(req.params.id);
      return res.status(HttpStatus.NO_CONTENT).jsend.success(null);
    },
  );

  return { route, routeName };
};
