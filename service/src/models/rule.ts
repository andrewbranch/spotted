import mongoose, { Document, Schema } from 'mongoose';
import ruleSchema from '../schemas/rule';
import logger from '../logger';
import { Recipient } from './recipient';
import { MessageType } from '../types/messageType';

export interface Rule {
  messageType: MessageType;
  messageFormat: string;
  enabled: boolean;
  recipients: Recipient[] | Schema.Types.ObjectId[] | string[];
};

export interface PopulatedRule extends Rule {
  recipients: Recipient[];
};

export default mongoose.model<Rule & Document>('Rule', ruleSchema);
logger.verbose('Registered Rule Mongoose model');
