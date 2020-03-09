import expressLoader from './express';
import dependencyInjectorLoader from './dependency-injector';
import mongooseLoader from './mongoose';
import Logger from './logger';

export default async ({ expressApp }) => {
  await mongooseLoader();
  Logger.info('✌️ DB loaded and connected!');

  // Injecting models into the DI container.
  const userModel = {
    name: 'userModel',
    model: require('@/models/user.model').default,
  };

  const cardModel = {
    name: 'cardModel',
    model: require('@/models/card.model').default,
  };

  const collectionModel = {
    name: 'collectionModel',
    model: require('@/models/collection.model').default,
  };

  await dependencyInjectorLoader({
    models: [userModel, cardModel, collectionModel],
  });

  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
