import { Document, Model, model } from 'mongoose';
import { POISchema, poiStatics } from '../schemas/poi';
import { Coordinates, POI as IPOI } from '../types';
import logger from '../logger';

export const POI = model<IPOI & Document>('POI', POISchema) as Model<IPOI & Document> & typeof poiStatics;
logger.verbose('Registered POI Mongoose model');
