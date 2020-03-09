import { Container } from 'typedi';
import { Request } from 'express';
import HttpStatus from 'http-status-codes';
import { ApiError } from '@/api/errors/api-error';
import UserService from '@/services/user.service';

export async function attachCurrentUser(req: Request, _res, next) {
  const userService = Container.get(UserService);
  const user = await userService.findById(req.token?._id);

  if (!user) {
    throw new ApiError('This user does not exist!', HttpStatus.UNAUTHORIZED);
  }

  req.user = user;

  next();
}
