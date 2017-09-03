import composeWithMongoose from 'graphql-compose-mongoose';
import { Rule } from '../../models';

export const RuleTC = composeWithMongoose(Rule);
