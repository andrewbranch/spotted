/* @flow */

import mongoose from 'mongoose';

const POISchema = mongoose.Schema({
  name: { type: String, required: true },
  location: {
    type: { type: String, enum: 'Point', default: 'Point' },
    coordinates: { type: [Number],   default: [0, 0] }
  },
});

POISchema.index({ location: '2dsphere' });
export default POISchema;
