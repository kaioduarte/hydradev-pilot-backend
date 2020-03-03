import jwt from 'jsonwebtoken';
import { Request } from 'express';
import HttpStatus from 'http-status-codes';
import config from '@/config';
import { ApiError } from '@/api/errors/api-error';

export function isAuthenticated(req: Request, _res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  jwt.verify(token, config.jwtSecret, async (err, decoded) => {
    if (err) {
      throw new ApiError(`JWT Error: ${err.message}`, HttpStatus.BAD_REQUEST);
    }

    req.token = decoded;

    return next();
  });
}
