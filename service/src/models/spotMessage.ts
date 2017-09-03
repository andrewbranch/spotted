import { Document, Model, model } from 'mongoose';
import { SpotMessageSchema, spotMessageStatics } from '../schemas';
import { SpotMessage as ISpotMessage } from '../types';
import logger from '../logger';

export const SpotMessage = model<ISpotMessage & Document>('SpotMessage', SpotMessageSchema) as Model<ISpotMessage & Document> & typeof spotMessageStatics;
logger.verbose('Registered Recipient Mongoose model');
