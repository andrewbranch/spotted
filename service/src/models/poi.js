/* @flow */

import mongoose from 'mongoose';
import poiSchema from '../schemas/poi';
import logger from '../logger';
import type { Coordinates } from '../types/coordinates';
import type { ModelConstructor, Model } from '../types/mongoose';

export interface POI {
  name: string;
  presenceRadius: number;
  preposition: string;
  coordinates: [number, number];
};

export default (mongoose.model('POI', poiSchema): ModelConstructor<POI, POI> & {
  near: (cooordinates: Coordinates, radiusMeters: number) => Promise<Model<POI>[]>
});

logger.verbose('Registered POI Mongoose model');
