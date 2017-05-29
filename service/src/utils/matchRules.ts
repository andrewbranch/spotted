import { Model } from 'mongoose';
import { SpotData } from '../types/spotData';
import Rule, { PopulatedRule } from '../models/rule';

export default (data: SpotData) => (
  Rule.find({ enabled: true, messageType: data.messageType }).populate({ path: 'recipients', model: 'Recipient' }).exec() as any as Promise<(PopulatedRule & Document)[]>
);
