import mongoose from 'mongoose';
import { Coordinates } from '../types/coordinates';

const POISchema = new mongoose.Schema({
  name: { type: String, required: true },
  presenceRadius: { type: Number, required: true }, // in miles
  preposition: { type: String, required: true }, // I am *in* San Francisco. I am *on* Mount Whitney. I am *at* home.
  location: {
    type: { type: String, enum: 'Point', default: 'Point', required: true },
    coordinates: { type: [Number], required: true },
  },
});

export const statics = {
  near: function(coordinates: Coordinates, radiusMeters: number) {
    return this.where('location').near({
      center: { coordinates: [coordinates[1], coordinates[0]], type: 'Point' },
      maxDistance: radiusMeters,
    }).exec();
  }
};

POISchema.index({ location: '2dsphere' });
Object.assign(POISchema.statics, statics);

// Mongoose stores lat/lng backwards (i.e., [lng, lat])
POISchema.virtual('coordinates').get(function () {
  return [this.location.coordinates[1], this.location.coordinates[0]];
});

export default POISchema;
