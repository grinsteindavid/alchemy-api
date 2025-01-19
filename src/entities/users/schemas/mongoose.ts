import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchemaMongoose = new Schema({
  firstName: {
    type: String,
    required: '{PATH} is required!',
  },
  lastName: {
    type: String,
    required: '{PATH} is required!',
  },
  email: {
    type: String,
    unique: true,
    required: '{PATH} is required!',
  },
  passwordHash: String,
  salt: String,
});
