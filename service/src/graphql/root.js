/* @flow */

import { GQC } from 'graphql-compose';
import PoiTC from './poi';
import RecipientTC from './recipient';
import RuleTC from './rule';

GQC.rootQuery().addFields({
  poiById: PoiTC.getResolver('findById'),
  poiByIds: PoiTC.getResolver('findByIds'),
  poiOne: PoiTC.getResolver('findOne'),
  poiMany: PoiTC.getResolver('findMany'),
  poiTotal: PoiTC.getResolver('count'),
  poiConnection: PoiTC.getResolver('connection'),

  recipientById: RecipientTC.getResolver('findById'),
  recipientByIds: RecipientTC.getResolver('findByIds'),
  recipientOne: RecipientTC.getResolver('findOne'),
  recipientMany: RecipientTC.getResolver('findMany'),
  recipientTotal: RecipientTC.getResolver('count'),
  recipientConnection: RecipientTC.getResolver('connection'),

  ruleById: RuleTC.getResolver('findById'),
  ruleByIds: RuleTC.getResolver('findByIds'),
  ruleOne: RuleTC.getResolver('findOne'),
  ruleMany: RuleTC.getResolver('findMany'),
  ruleTotal: RuleTC.getResolver('count'),
  ruleConnection: RuleTC.getResolver('connection'),
});

GQC.rootMutation().addFields({
  poiCreate: PoiTC.getResolver('createOne'),
  poiUpdateById: PoiTC.getResolver('updateById'),
  poiUpdateOne: PoiTC.getResolver('updateOne'),
  poiRemoveById: PoiTC.getResolver('removeById'),
  poiRemoveMany: PoiTC.getResolver('removeMany'),

  recipientCreate: RecipientTC.getResolver('createOne'),
  recipientUpdateById: RecipientTC.getResolver('updateById'),
  recipientUpdateOne: RecipientTC.getResolver('updateOne'),

  ruleCreate: RuleTC.getResolver('createOne'),
  ruleUpdateById: RuleTC.getResolver('updateById'),
  ruleUpdateOne: RuleTC.getResolver('updateOne'),
  ruleRemoveById: RuleTC.getResolver('removeById'),
  ruleRemoveMany: RuleTC.getResolver('removeMany'),
});

export default GQC.buildSchema();
