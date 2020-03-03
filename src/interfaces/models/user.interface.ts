import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  role: string;
  username: string;
  password: string;
}
