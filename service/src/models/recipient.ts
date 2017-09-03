import { Document, model } from 'mongoose';
import { RecipientSchema } from '../schemas';
import { Recipient as IRecipient } from '../types';
import logger from '../logger';

export const Recipient = model<IRecipient & Document>('Recipient', RecipientSchema);
logger.verbose('Registered Recipient Mongoose model');
