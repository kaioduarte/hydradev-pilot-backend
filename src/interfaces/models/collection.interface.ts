import { Document } from 'mongoose';
import { ICard } from './card.interface';
import { IUser } from './user.interface';

export interface ICollection extends Document {
  _id: string;
  name: string;
  cards: ICard[];
  user?: IUser;
}
