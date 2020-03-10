import { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  role: string;
  username: string;
  password: string;
}
