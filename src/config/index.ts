import DevelopmentConfig from './development.config';
import ProductionConfig from './production.config';

export default () => {
  if (process.env.NODE_ENV === 'development') {
    return DevelopmentConfig;
  }
  if (process.env.NODE_ENV === 'production') {
    return ProductionConfig;
  }
  return {};
};
