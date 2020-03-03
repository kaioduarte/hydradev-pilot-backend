import { Model } from 'mongoose';
import { IUser } from '@/interfaces/models/user.interface';

declare global {
  namespace Models {
    export type UserModel = Model<IUser>;
  }
}
