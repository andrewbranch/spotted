import { Model, Document } from 'mongoose';
import { SpotMessage, PopulatedRule } from '../types';
import { Rule } from '../models';

export const matchRules = (data: SpotMessage) => (
  Rule.find({ enabled: true, messageType: data.messageType }).populate({ path: 'recipients', model: 'Recipient' }).exec() as any as Promise<(PopulatedRule & Document)[]>
);
