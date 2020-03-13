import mongoose, { Schema } from 'mongoose';
import { ICollection } from '@/interfaces/models/collection.interface';

const CollectionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter a name'],
      index: true,
      minlength: 3,
      maxlength: 255,
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
    },
  },
  { timestamps: true },
);

export default mongoose.model<ICollection>('Collection', CollectionSchema);
