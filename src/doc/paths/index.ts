import healthCheck from './health-check';
import users from './users';

export default {
  ...healthCheck,
  ...users,
};

