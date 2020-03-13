import { ICard } from '@/interfaces/models/card.interface';
import mongoose, { Schema } from 'mongoose';

const CardSchema = new Schema(
  {
    // image: {
    //   type: Buffer,
    //   required: true,
    // },

    mana: {
      type: Number,
      required: true,
      min: 0,
    },

    name: {
      type: String,
      required: [true, 'Please enter a name'],
      index: true,
    },

    description: {
      type: String,
      maxlength: 255,
    },

    type: {
      type: String,
      enum: ['creature', 'sorcery', 'instant', 'artifact', 'land'],
      required: true,
    },

    attack: {
      type: Number,
      min: 0,
    },
    defense: {
      type: Number,
      min: 0,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export default mongoose.model<ICard>('Card', CardSchema);
