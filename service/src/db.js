/* @flow */

import mongoose from 'mongoose';
import recipientSchema from './schemas/recipient';
import logger from './logger';

const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASS,
  MONGO_DB
} = process.env;

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

export default () => new Promise((resolve, reject) => {
  mongoose.connect(MONGO_URI, err => {
    mongoose.model('Recipient', recipientSchema);
    logger.verbose('Registered Recipient Mongoose model');
    return err ? reject(err) : resolve();
  });
});
