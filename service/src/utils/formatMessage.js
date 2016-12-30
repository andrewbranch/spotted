/* @flow */

import type { Model } from '../types/mongoose';
import type { PopulatedRule } from '../models/rule';
import type { SpotData } from '../types/spotData';

export default (rule: Model<PopulatedRule>, data: SpotData): Promise<string> => {
  return Promise.resolve('');
};
