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
    },

    name: {
      type: String,
      required: [true, 'Please enter a name'],
      index: true,
    },

    description: String,

    type: {
      type: String,
      enum: ['creature', 'sorcery', 'instant', 'artifact', 'land'],
      required: true,
    },

    attack: Number,
    defense: Number,

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export default mongoose.model<ICard>('Card', CardSchema);
