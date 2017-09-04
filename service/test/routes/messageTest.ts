import * as tape from 'tape';
import * as path from 'path';
import * as fs from 'fs';
import { verify, when, replace, matchers, function as fn } from 'testdouble';
import { SpotMessage } from '../../src/models';
import { Rule } from '../../src/types';
import { processMessageRequest } from '../../src/routes/lib';

const headers1 = '[["X-Spot-Time", "1495424570"],["X-Spot-Latitude", "37.12345"],["X-Spot-Longitude", "-122.12345"],["X-Spot-Type", "Help"],["X-Spot-Messenger", "Where is Andrew"]]';
const headers2 = '[["X-Spot-Time", "1495424570"],["X-Spot-Latitude", "37.12345"],["X-Spot-Longitude", "-122.12345"],["X-Spot-Type", "Help"],["X-Spot-Messenger", "Dónde está Andrew"]]';
const headers3 = '[["X-Spot-Time", "1495424570"],["X-Spot-Latitude", "37.12345"],["X-Spot-Longitude", "-122.12345"],["X-Spot-Type", "Help"],["X-Spot-Messenger", "This is a duplicate message"]]';
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

const saveMessage = fn('SpotMessage.create');
const findDuplicateMessages = fn('findDuplicateMessages');
const sendMessage = fn('sendMessage');
const matchRules = fn('matchRules');
replace(SpotMessage, 'create', saveMessage);
replace(require('../../src/utils'), 'findDuplicateMessages', findDuplicateMessages)
replace(require('../../src/utils'), 'matchRules', matchRules);
replace(require('../../src/utils'), 'sendMessage', sendMessage);
when(findDuplicateMessages(), { ignoreExtraArgs: true }).thenResolve([])
when(saveMessage(), { ignoreExtraArgs: true }).thenResolve(null);
when(sendMessage(), { ignoreExtraArgs: true }).thenResolve(null);
when(matchRules(matchers.contains({ deviceName: 'Where is Andrew' }))).thenResolve([rule]);
when(matchRules(matchers.contains({ deviceName: 'Dónde está Andrew' }))).thenResolve([rule, rule]);

tape('processMessageRequest: saves message, matches one rule, and sends to one recipient', async t => {
  await processMessageRequest(headers1, body);
  verify(saveMessage(matchers.contains({
    messageType: 'help',
    coordinates: {
      type: 'Point',
      coordinates: [-122.12345, 37.12345]
    }
  })), { times: 1 });
  verify(sendMessage('1', rule.recipients[0]), { times: 1 });
  t.end();
});

tape('processMessageRequest: matches multiple rules and sends messages for each', async t => {
  const modifiedRule = { ...rule, messageFormat: '2' };
  when(sendMessage(), { ignoreExtraArgs: true }).thenResolve(null);
  when(matchRules(), { ignoreExtraArgs: true }).thenResolve([modifiedRule, modifiedRule]);
  await processMessageRequest(headers2, body);
  verify(sendMessage('2', rule.recipients[0]), { times: 2 });
  t.end();
});

tape('processMessageRequest: sends a message to each recipient on a rule', async t => {
  const modifiedRule = { ...rule, messageFormat: '3', recipients: [rule.recipients[0], rule.recipients[0]] };
  when(sendMessage(), { ignoreExtraArgs: true }).thenResolve(null);
  when(matchRules(), { ignoreExtraArgs: true }).thenResolve([modifiedRule, modifiedRule]);
  await processMessageRequest(headers2, body);
  verify(sendMessage('3', rule.recipients[0]), { times: 4 });
  t.end();
});

tape('processMessageRequest: ignores duplicate messages', async t => {
  const modifiedRule = { ...rule, messageFormat: '4' };
  when(findDuplicateMessages(matchers.contains({ deviceName: 'This is a duplicate message' }))).thenResolve([{}]);
  when(matchRules(), { ignoreExtraArgs: true }).thenResolve([modifiedRule, modifiedRule]);
  await processMessageRequest(headers3, body);
  verify(sendMessage('4', rule.recipients[0]), { times: 0 });
  t.end();
});
