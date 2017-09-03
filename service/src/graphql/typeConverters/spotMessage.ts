import composeWithMongoose from 'graphql-compose-mongoose';
import { SpotMessage } from '../../models';

export const SpotMessageTC = composeWithMongoose(SpotMessage);
