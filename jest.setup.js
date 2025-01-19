const envs = {
  // DO NOT CHANGE IT - CRITICAL TO NOT AFFECT PRODUCTION DB
  ENVIRONMENT: 'jest-test',
  MONGO_URL: '',
  // DO NOT CHANGE IT - CRITICAL TO NOT AFFECT PRODUCTION DB
  NODE_ENV: 'jest-test',
  DEBUG: true,
  REDIS_URL: 'redis://',
  REDIS_WRITE_URL: '',
  PORT: 8000,
  MAX_RETRIES: 6,
  CLUSTER_REGION: '',
  CLUSTER_TYPE: 'LOCAL',
  SESSION_SECRET: '',
};

Object.keys(envs).forEach((key) => {
  process.env[key] = envs[key];
});

require('./logger.js');
