/* @flow */

import type { SpotData } from '../types/spotData';
import type { Model } from '../types/mongoose';
import type { PopulatedRule } from '../models/rule';
import Rule from '../models/rule';

export default (data: SpotData): Promise<Model<PopulatedRule>[]> => (
  Rule.find({ enabled: true, messageType: data.messageType }).populate({ path: 'recipients', model: 'Recipient' }).exec()
);
