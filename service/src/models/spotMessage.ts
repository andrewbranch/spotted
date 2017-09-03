import { Document, model } from 'mongoose';
import { SpotMessageSchema } from '../schemas';
import { SpotMessage as ISpotMessage } from '../types';
import logger from '../logger';

export const SpotMessage = model<ISpotMessage & Document>('SpotMessage', SpotMessageSchema);
logger.verbose('Registered Recipient Mongoose model');
