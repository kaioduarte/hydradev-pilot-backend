import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '@/config';

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.databaseURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  return connection.connection.db;
};
