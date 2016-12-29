/* @flow */

import mongoose from 'mongoose';
import typeof { default as Recipient } from './recipient';
import type { MessageType } from '../utils/messageTypes';

if (!mongoose.models.Rule) {
  throw new Error('Rule model has not been registered yet');
}

type Rule = {
  recipients: mixed[];
  messageType: MessageType;
  messageFormat: string;
  enabled: boolean;
  [key: string]: any;
};

export default (mongoose.models.Rule: Rule);
