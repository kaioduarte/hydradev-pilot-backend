import { IUser } from '@/interfaces/models/user.interface';

declare module 'express-serve-static-core' {
  export interface Request {
    token?: { _id: string };
    user?: IUser;
  }

  export interface Response {
    jsend: jsend.jsendExpress;
  }
}
