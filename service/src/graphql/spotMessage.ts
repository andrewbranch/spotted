import composeWithMongoose from 'graphql-compose-mongoose';
import SpotMessage from '../models/spotMessage';

export default composeWithMongoose(SpotMessage);
