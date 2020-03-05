import { Container } from 'typedi';
import { Router, Request, Response } from 'express';
import { celebrate, Joi } from 'celebrate';
import AuthService from '@/services/auth.service';
import { ISignUpDto } from '@/interfaces/dto/sign-up.dto';
import HttpStatus from 'http-status-codes';
import { ISignInDto } from '@/interfaces/dto/sign-in.dto';

const route = Router();

export default (app: Router) => {
  const routeName = '/auth';
  const authService = Container.get(AuthService);

  app.use(routeName, route);

  route.post(
    '/signup',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response) => {
      const { user, token } = await authService.signUp(req.body as ISignUpDto);

      return res.status(HttpStatus.OK).jsend.success({
        user,
        token,
      });
    },
  );

  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response) => {
      const { user, token } = await authService.signIn(req.body as ISignInDto);
      return res.status(HttpStatus.OK).jsend.success({
        user,
        token,
      });
    },
  );

  return { route, routeName };
};
