import { IUser } from '../models/user.interface';

export interface ICreateCardDto {
  image?: Buffer;
  mana: number;
  name: string;
  description: string;
  type: 'creature' | 'sorcery' | 'instant' | 'artifact' | 'land';
  attack?: number;
  defense?: number;
  user?: IUser;
}
