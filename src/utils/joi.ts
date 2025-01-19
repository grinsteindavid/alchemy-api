import Joi from 'joi';
import { ENTITIES } from '../entities/types';
import * as MongooseEntityModels from '../entities';

export const JoiModelsDefinitions: { [key in `${ENTITIES}`]?: Joi.ObjectSchema<any> } = {
  [`${ENTITIES.USERS}`]: MongooseEntityModels.UserSchemaJoi,
};
