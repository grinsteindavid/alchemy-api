
import { Schema, Model, Document } from 'mongoose';
import * as MongooseEntityModels from '../entities';
import { ENTITIES } from '../entities/types';
import { getMongooseClient } from '../data-sources/mongoose';

export const MongooseModelsDefinitions: {
  [key in `${ENTITIES}`]?: Schema<Document<any, any>, Model<any, any, any>, undefined>;
} = {
  [`${ENTITIES.USERS}`]: MongooseEntityModels.UserSchemaMongoose,
};

export const registerMongooseModels = (
  predefinedModels: {
    [x: string]: Schema<Document<any, any>, Model<any, any, any>, undefined>;
  } = {},
) => {
  const mongodbClient = getMongooseClient();

  if (Object.keys(predefinedModels).length === 0) {
    Object.keys(MongooseModelsDefinitions).forEach((key) => {
      mongodbClient.model(key, MongooseModelsDefinitions[key as keyof typeof MongooseModelsDefinitions]);
    });
  } else {
    Object.keys(predefinedModels).forEach((key) => {
      mongodbClient.model(key, predefinedModels[key]);
    });
  }
};

export const getModel = <C extends Document>(collectionName: `${ENTITIES}`, schema: Schema): Model<C> => {
  const mongodbClient = getMongooseClient();

  return mongodbClient.models[collectionName] || mongodbClient.model(collectionName, schema);
};