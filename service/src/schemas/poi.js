/* @flow */

import mongoose from 'mongoose';
import type { Coordinates } from '../types/coordinates';

const POISchema = mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: 'Point', default: 'Point', required: true },
    coordinates: { type: [Number], required: true }
  },
});

POISchema.index({ location: '2dsphere' });
POISchema.statics.near = (coordinates: Coordinates, radius: number) => {
  return POISchema.where('location').near({
    center: { coordinates, type: 'Point' },
    maxDistance: radius,
  }).exec();
};

// Mongoose stores lat/lng backwards (i.e., [lng, lat])
POISchema.virtual('coordinates').get(function () {
  return [this.location.coordinates[1], this.location.coordinates[0]];
});

export default POISchema;
