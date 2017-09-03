import * as mongoose from 'mongoose';
import { MapsProvider } from '../types';
const mapsProviders: MapsProvider[] = ['Apple', 'Google'];
const defaultMapsProvider: MapsProvider = 'Google';

export const RecipientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  preferences: {
    mapsProvider: { type: String, enum: mapsProviders, required: true, default: defaultMapsProvider }
  }
});
