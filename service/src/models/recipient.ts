import mongoose, { Document } from 'mongoose';
import recipientSchema from '../schemas/recipient';
import logger from '../logger';

export interface Recipient {
  name: string;
  phone: string;
  preferences: {
    [key: string]: any;
  }
}

export default mongoose.model<Recipient & Document>('Recipient', recipientSchema);
logger.verbose('Registered Recipient Mongoose model');
