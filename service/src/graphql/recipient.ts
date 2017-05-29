import composeWithMongoose from 'graphql-compose-mongoose';
import Recipient from '../models/recipient';

export default composeWithMongoose(Recipient);
