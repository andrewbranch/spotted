import { Document, Schema, model } from 'mongoose';
import { RuleSchema } from '../schemas';
import { Rule as IRule } from '../types';
import logger from '../logger';

export const Rule = model<IRule & Document>('Rule', RuleSchema);
logger.verbose('Registered Rule Mongoose model');
