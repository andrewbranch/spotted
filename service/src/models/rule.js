/* @flow */

import mongoose from 'mongoose';
import ruleSchema from '../schemas/rule';
import logger from '../logger';
import type { ModelConstructor } from '../types/mongoose';
import type { Recipient } from './recipient';
import type { MessageType } from '../types/messageType';

export interface Rule {
  messageType: MessageType;
  messageFormat: string;
  enabled: boolean;
  [key: string]: any;
};

export interface PopulatedRule extends Rule {
  recipients: Recipient[];
};

export default (mongoose.model('Rule', ruleSchema): ModelConstructor<Rule, PopulatedRule>);
logger.verbose('Registered Rule Mongoose model');
