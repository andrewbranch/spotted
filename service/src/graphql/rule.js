/* @flow */

import composeWithMongoose from 'graphql-compose-mongoose';
import Rule from '../models/rule';

export default composeWithMongoose(Rule);
