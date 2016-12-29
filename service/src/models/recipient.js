/* @flow */

import mongoose from 'mongoose';

if (!mongoose.models.Recipient) {
  throw new Error('Recipient model has not been registered yet');
}

interface Recipient {
  name: string;
  phone?: string;
  email?: string;
  [key: string]: any;
};

export default (mongoose.models.Recipient: Recipient);
