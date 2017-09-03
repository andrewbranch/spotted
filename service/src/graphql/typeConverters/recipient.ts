import composeWithMongoose from 'graphql-compose-mongoose';
import { Recipient } from '../../models';

export const RecipientTC = composeWithMongoose(Recipient);
