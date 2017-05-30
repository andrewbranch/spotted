import * as tape from 'tape';
import * as path from 'path';
import * as fs from 'fs';
import { verify, when, replace, matchers, function as fn } from 'testdouble';
import { Rule } from '../../src/models/rule';
import processMessageReqeuest from '../../src/routes/lib/processMessageRequest';

const headers1 = '[["X-Spot-Time", "1495424570"],["X-Spot-Latitude", "37.12345"],["X-Spot-Longitude", "-122.12345"],["X-Spot-Type", "Help"],["X-Spot-Messenger", "Where is Andrew"]]';
const headers2 = '[["X-Spot-Time", "1495424570"],["X-Spot-Latitude", "37.12345"],["X-Spot-Longitude", "-122.12345"],["X-Spot-Type", "Help"],["X-Spot-Messenger", "Dónde está Andrew"]]';
const body = fs.readFileSync(path.resolve(__dirname, '../utils/emails/help.txt'), 'utf8');

const rule: Rule = {
  messageType: 'help',
  enabled: true,
  messageFormat: '1',
  recipients: [{
    name: 'Andrew',
    phone: '+15555555555',
    preferences: {
      mapsProvider: 'Google'
    }
  }]
};

const sendMessage = fn('sendMessage');
const matchRules = fn('matchRules');
replace(require('../../src/utils/matchRules'), 'default', matchRules);
replace(require('../../src/utils/sendMessage'), 'default', sendMessage);
when(sendMessage(), { ignoreExtraArgs: true }).thenResolve(null);
when(matchRules(matchers.contains({ deviceName: 'Where is Andrew' }))).thenResolve([rule]);
when(matchRules(matchers.contains({ deviceName: 'Dónde está Andrew' }))).thenResolve([rule, rule]);

tape('processMessageRequest: matches one rule and sends message to one recipient', async t => {
  try {
    await processMessageReqeuest(headers1, body);
    t.doesNotThrow(() => verify(sendMessage('1', rule.recipients[0]), { times: 1 }));
    t.end();
  } catch (err) {
    t.end(err);
  }
});

tape('processMessageRequest: matches multiple rules and sends messages for each', async t => {
  const modifiedRule = { ...rule, messageFormat: '2' };
  when(sendMessage(), { ignoreExtraArgs: true }).thenResolve(null);
  when(matchRules(), { ignoreExtraArgs: true }).thenResolve([modifiedRule, modifiedRule]);
  try {
    await processMessageReqeuest(headers2, body);
    t.doesNotThrow(() => verify(sendMessage('2', rule.recipients[0]), { times: 2 }));
    t.end();
  } catch (err) {
    t.end(err);
  }
});

tape('processMessageRequest: sends a message to each recipient on a rule', async t => {
  const modifiedRule = { ...rule, messageFormat: '3', recipients: [rule.recipients[0], rule.recipients[0]] };
  when(sendMessage(), { ignoreExtraArgs: true }).thenResolve(null);
  when(matchRules(), { ignoreExtraArgs: true }).thenResolve([modifiedRule, modifiedRule]);
  try {
    await processMessageReqeuest(headers2, body);
    t.doesNotThrow(() => verify(sendMessage('3', rule.recipients[0]), { times: 4 }));
    t.end();
  } catch (err) {
    t.end(err);
  }
});
