import { GQC } from 'graphql-compose';
import { PoiTC, RecipientTC, RuleTC, SpotMessageTC } from './typeConverters';

GQC.rootQuery().addFields({
  poi: PoiTC.getResolver('findById'),
  pois: PoiTC.getResolver('findMany'),
  poiCount: PoiTC.getResolver('count'),
  poiConnection: PoiTC.getResolver('connection'),

  recipient: RecipientTC.getResolver('findById'),
  recipients: RecipientTC.getResolver('findMany'),
  recipientCount: RecipientTC.getResolver('count'),
  recipientConnection: RecipientTC.getResolver('connection'),

  rule: RuleTC.getResolver('findById'),
  rules: RuleTC.getResolver('findMany'),
  ruleCount: RuleTC.getResolver('count'),
  ruleConnection: RuleTC.getResolver('connection'),

  spotMessage: SpotMessageTC.getResolver('findById'),
  spotMessages: SpotMessageTC.getResolver('findMany'),
  spotMessageCount: SpotMessageTC.getResolver('count'),
  spotMessageConnection: SpotMessageTC.getResolver('connection'),
});

GQC.rootMutation().addFields({
  createPOI: PoiTC.getResolver('createOne'),
  updatePOI: PoiTC.getResolver('updateById'),
  removePOI: PoiTC.getResolver('removeById'),
  removePOIs: PoiTC.getResolver('removeMany'),

  createRecipient: RecipientTC.getResolver('createOne'),
  updateRecipient: RecipientTC.getResolver('updateById'),

  createRule: RuleTC.getResolver('createOne'),
  updateRule: RuleTC.getResolver('updateById'),
  removeRule: RuleTC.getResolver('removeById'),
  removeRules: RuleTC.getResolver('removeMany'),

  createSpotMessage: SpotMessageTC.getResolver('createOne'),
  updateSpotMessage: SpotMessageTC.getResolver('updateById'),
  removeSpotMessage: SpotMessageTC.getResolver('removeById'),
  removeSpotMessages: SpotMessageTC.getResolver('removeMany'),
});

export const RootSchema = GQC.buildSchema();
