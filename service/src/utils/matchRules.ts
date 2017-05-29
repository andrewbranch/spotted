import { SpotData } from '../types/spotData';
import { Model } from '../types/mongoose';
import Rule, { PopulatedRule } from '../models/rule';

export default (data: SpotData): Promise<Model<PopulatedRule>[]> => (
  Rule.find({ enabled: true, messageType: data.messageType }).populate({ path: 'recipients', model: 'Recipient' }).exec()
);
