/* @flow */

import mongoose from 'mongoose';
import type { Coordinates } from '../types/coordinates';

const POISchema = mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: 'Point', default: 'Point' },
    coordinates: { type: [Number],   default: [0, 0] }
  },
});

POISchema.index({ location: '2dsphere' });
POISchema.statics.near = (coordinates: Coordinates, radius: number) => {
  return POISchema.where('location').near({
    center: { coordinates, type: 'Point' },
    maxDistance: radius,
  }).exec();
};

export default POISchema;
