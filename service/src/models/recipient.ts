import{ Document, model } from 'mongoose';
import recipientSchema from '../schemas/recipient';
import { MapsProvider } from '../types/mapsProvider';
import logger from '../logger';

export interface Recipient {
  name: string;
  phone: string;
  preferences: {
    mapsProvider: MapsProvider;
  }
}

export default model<Recipient & Document>('Recipient', recipientSchema);
logger.verbose('Registered Recipient Mongoose model');
