import mongoose from 'mongoose';
import type { MapsProvider } from '../types/mapsProvider';
const mapsProviders: MapsProvider[] = ['Apple', 'Google'];
const defaultMapsProvider: MapsProvider = 'Google';

export default mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  preferences: {
    mapsProvider: { type: String, enum: mapsProviders, required: true, default: defaultMapsProvider }
  }
});
