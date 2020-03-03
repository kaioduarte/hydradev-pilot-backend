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

  await dependencyInjectorLoader({
    models: [userModel],
  });

  Logger.info('✌️ Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
