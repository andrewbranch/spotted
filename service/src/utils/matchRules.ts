import { Model } from 'mongoose';
import { SpotMessage } from '../types/spotMessage';
import Rule, { PopulatedRule } from '../models/rule';

export default (data: SpotMessage) => (
  Rule.find({ enabled: true, messageType: data.messageType }).populate({ path: 'recipients', model: 'Recipient' }).exec() as any as Promise<(PopulatedRule & Document)[]>
);
