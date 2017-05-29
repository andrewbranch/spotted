import mongoose, { Document, Model } from 'mongoose';
import poiSchema, { statics } from '../schemas/poi';
import logger from '../logger';
import { Coordinates } from '../types/coordinates';

export interface POI {
  name: string;
  presenceRadius: number;
  preposition: string;
  coordinates: Coordinates;
};

export default mongoose.model<POI & Document>('POI', poiSchema) as Model<POI & Document> & typeof statics;
logger.verbose('Registered POI Mongoose model');
