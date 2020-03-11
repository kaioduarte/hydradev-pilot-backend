import { IUser } from '@/interfaces/models/user.interface';
import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a full name'],
      index: true,
      minlength: 3,
      maxlength: 255,
      trim: true,
    },

    username: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
      minlength: 3,
      maxlength: 64,
      trim: true,
    },

    password: {
      type: String,
      select: false,
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ['basic', 'admin'],
      default: 'basic',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
