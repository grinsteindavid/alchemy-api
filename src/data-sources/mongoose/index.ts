import mongoose, {Mongoose, ConnectOptions} from 'mongoose';
import MonoContext from '@simplyhexagonal/mono-context';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

const { MONGO_URL, NODE_ENV } = process.env


export const initMongoose = async () => {
  const appName = MonoContext.getStateValue('appName');
  const logger = MonoContext.getStateValue('logger');
  const mongoMemoryInstance = NODE_ENV === 'jest-test' ? await MongoMemoryServer.create() : undefined;
  const connectionUrl = mongoMemoryInstance ? mongoMemoryInstance.getUri() : MONGO_URL! ;

  const connection = mongoose.connection;

  connection.on('error', (error: any) => {
    logger.error(`Error in Mongoose connection: ${JSON.stringify(error)}`);
    throw new Error(error);
  });

  connection.on('connected', () => {
    logger.info(`Mongoose: Connected to ${connectionUrl}`);
  });

  connection.on('reconnectFailed', () => {
    logger.error('Mongoose: DB Connection Lost, retries failed');
  });

  await mongoose.connect(connectionUrl, {
    dbName: NODE_ENV === 'development' ? 'development' : undefined,
    appname: appName,
    autoIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  MonoContext.setState({
    dataSources: {
      ...(MonoContext.getState()['dataSources'] || {}),
      mongoose,
    },
  });
};

export const getMongooseClient = () => {
  const dataSources = MonoContext.getState()['dataSources'] as {
    mongoose: Mongoose;
  };

  if (!dataSources.mongoose) throw new Error(`No mongoose client found`);

  return dataSources.mongoose;
};
