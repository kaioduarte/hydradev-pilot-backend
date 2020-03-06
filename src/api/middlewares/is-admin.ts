import { Request } from 'express';
import HttpStatus from 'http-status-codes';
import { ApiError } from '@/api/errors/api-error';

export function isAdmin(req: Request, _res, next) {
  if (req.user?.role !== 'admin') {
    throw new ApiError(
      "You don't have permission to perform this action",
      HttpStatus.FORBIDDEN,
    );
  }

  return next();
}
