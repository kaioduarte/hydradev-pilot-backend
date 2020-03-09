import mongoose, { Schema } from 'mongoose';
import { ICard } from '@/interfaces/models/card.interface';
import { ICollection } from '@/interfaces/models/collection.interface';

function arrayLimit(val: ICard[]) {
  return val.length <= 60;
}

const CollectionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name'],
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    cards: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Card',
        },
      ],
      validate: [arrayLimit, '{PATH} exceeds the limit of 60'],
    },
  },
  { timestamps: true },
);

export default mongoose.model<ICollection>('Collection', CollectionSchema);
