import * as dev from './environment';
import * as prod from './environment.prod';

export default () => {
  if (process.env.NODE_ENV === 'development') {
    return dev.environment;
  }
  if (process.env.NODE_ENV === 'production') {
    return prod.environment;
  }
  return {};
};
