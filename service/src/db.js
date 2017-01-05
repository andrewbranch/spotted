/* @flow */

import mongoose from 'mongoose';
import recipientSchema from './schemas/recipient';
import ruleSchema from './schemas/rule';
import logger from './logger';

const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USER,
  MONGO_PASS,
  MONGO_DB
} = process.env;

if (!MONGO_HOST || !MONGO_PORT || !MONGO_USER || !MONGO_PASS || !MONGO_DB) {
  throw new Error('Mongo connection information missing from environment');
}

const MONGO_URI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

mongoose.model('Recipient', recipientSchema);
logger.verbose('Registered Recipient Mongoose model');
mongoose.model('Rule', ruleSchema);
logger.verbose('Registered Rule Mongoose model');

export default () => new Promise((resolve, reject) => {
  mongoose.connect(MONGO_URI, err => {
    return err ? reject(err) : resolve();
  });
});
