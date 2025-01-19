import mongoose from 'mongoose';
import { UserSchemaMongoose } from './schemas/mongoose';
import { UserFixture } from './fixtures';
import { UserSchemaJoi } from './schemas/joi';
import { ENTITIES } from '../types';

describe('User', () => {
  it('validates Joi schema', async () => {
    let errors = undefined;

    try {
      await UserSchemaJoi.validateAsync(UserFixture, {
        abortEarly: false,
      });
    } catch (error) {
      errors = error;
    }

    expect(errors).toBeUndefined();
  });

  it('validates Mongoose schema', async () => {
    const model = mongoose.model(ENTITIES.USERS, UserSchemaMongoose);
    let errors = undefined;
    try {
      const instance = new model(UserFixture);
      await instance.validate();
    } catch (error) {
      errors = error;
    }
    expect(errors).toBeUndefined();
  });
});
