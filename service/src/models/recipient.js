/* @flow */

import mongoose from 'mongoose';
import recipientSchema from '../schemas/recipient';
import logger from '../logger';
import type { ModelConstructor } from '../types/mongoose';

export interface Recipient {
  name: string;
  phone: string;
  [key: string]: any;
};

export default (mongoose.model('Recipient', recipientSchema): ModelConstructor<Recipient, Recipient>);
logger.verbose('Registered Recipient Mongoose model');
