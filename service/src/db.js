/* @flow */

import mongoose from 'mongoose';

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
    return err ? reject(err) : resolve();
  });
});
