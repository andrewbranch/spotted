/* @flow */

import composeWithMongoose from 'graphql-compose-mongoose';
import POI from '../models/poi';

export default composeWithMongoose(POI);
