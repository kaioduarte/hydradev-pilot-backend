import { Model } from 'mongoose';
import { IUser } from '@/interfaces/models/user.interface';
import { ICard } from '@/interfaces/models/card.interface';
import { ICollection } from '@/interfaces/models/collection.interface';

declare global {
  namespace Models {
    export type UserModel = Model<IUser>;
    export type CardModel = Model<ICard>;
    export type CollectionModel = Model<ICollection>;
  }
}
