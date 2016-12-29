/* @flow */

import mongoose from 'mongoose';
import typeof { default as Recipient } from './recipient';
import type { MessageType } from '../utils/messageTypes';

if (!mongoose.models.Rule) {
  throw new Error('Rule model has not been registered yet');
}

export interface Rule {
  messageType: MessageType;
  messageFormat: string;
  enabled: boolean;
  [key: string]: any;
};

export interface PopulatedRule extends Rule {
  recipients: Recipient[];
}

export default (mongoose.models.Rule: Rule);
