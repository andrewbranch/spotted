/* @flow */

import mongoose from 'mongoose';
import type { ModelConstructor } from '../types/mongoose';

if (!mongoose.models.POI) {
  throw new Error('POI model has not been registered yet');
}

export interface POI {
  name: string;
  location: {
    type: 'Point',
    coordinates: [number, number]
  };
};

export default (mongoose.models.POI: ModelConstructor<POI, POI>);
