import composeWithMongoose from 'graphql-compose-mongoose';
import { POI } from '../../models';

export const PoiTC = composeWithMongoose(POI);
