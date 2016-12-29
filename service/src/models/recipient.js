/* @flow */

import mongoose from 'mongoose';

if (!mongoose.models.Recipient) {
  throw new Error('Recipient model has not been registered yet');
}

type Recipient = {
  name: string;
  phone?: string;
  email?: string;
};

export default (mongoose.models.Recipient: Recipient);
