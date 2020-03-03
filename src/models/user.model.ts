import { IUser } from '@/interfaces/models/user.interface';
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
      index: true,
    },

    username: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },

    password: String,

    role: {
      type: String,
      default: 'basic',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
