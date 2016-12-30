/* @flow */

import mongoose from 'mongoose';
import type { ModelConstructor } from '../types/mongoose';

if (!mongoose.models.Recipient) {
  throw new Error('Recipient model has not been registered yet');
}

export interface Recipient {
  name: string;
  phone: string;
  [key: string]: any;
};

export default (mongoose.models.Recipient: ModelConstructor<Recipient, Recipient>);
