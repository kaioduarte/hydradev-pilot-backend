import { Document, Schema } from 'mongoose';
import { ICard } from './card.interface';
import { IUser } from './user.interface';

export interface ICollection extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  cards: ICard[];
  user?: IUser;
}
