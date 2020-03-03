import { Container } from 'typedi';
import LoggerInstance from './logger';
import { Model } from 'mongoose';

export default ({
  models,
}: {
  models: { name: string; model: typeof Model }[];
}) => {
  try {
    models.forEach(m => Container.set(m.name, m.model));
    Container.set('logger', LoggerInstance);
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};
