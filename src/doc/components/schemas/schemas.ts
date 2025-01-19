import { OpenAPIV3 } from 'openapi-types';
import { ISchema } from '../types';
import M2S from 'mongoose-to-swagger';
import mongoose from 'mongoose';
import { MongooseModelsDefinitions } from '../../../utils/mongoose';

const generateMongooseSchemas = (options?: {
  props?: string[];
  omitFields?: string[];
  omitMongooseInternals?: boolean;
}) => {
  let schemas = {} as Record<ISchema, OpenAPIV3.SchemaObject>;
  const keys = Object.keys(MongooseModelsDefinitions) as ISchema[];

  keys.forEach((key) => {
    schemas![key] = M2S(mongoose.model(key, MongooseModelsDefinitions[key]), options);
  });

  return schemas;
};

export const schemas = generateMongooseSchemas();
export const schemasCreateUpdateDTO = generateMongooseSchemas({
  omitFields: ['_id', '__v', 'createdAt', 'updatedAt', 'created_on', 'updated_on'],
});

