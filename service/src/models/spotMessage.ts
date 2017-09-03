import{ Document, model } from 'mongoose';
import spotMessageSchema from '../schemas/spotMessage';
import { SpotMessage } from '../types';
import logger from '../logger';

export default model<SpotMessage & Document>('Recipient', spotMessageSchema);
logger.verbose('Registered Recipient Mongoose model');
