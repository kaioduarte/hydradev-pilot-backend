import { Document } from 'mongoose';
import { IUser } from './user.interface';

export interface ICard extends Document {
  _id: string;
  image: Buffer;
  mana: number;
  name: string;
  description: string;
  type: 'creature' | 'sorcery' | 'instant' | 'artifact' | 'land';
  attack?: number;
  defense?: number;
  user?: IUser;
}
