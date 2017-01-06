/* @flow */

import type { SpotData } from '../../src/types/spotData';
import type { MessageType } from '../../src/types/messageType';
import tape from 'tape';
import parseMessage from '../../src/utils/parseMessage';
import fs from 'fs';
import path from 'path';

type Email = {
  headers: Map<string, string>;
  subject: string;
  body: string;
  type: MessageType;
};

const commonHeaders = [['X-Spot-Latitude', '37.77402'], ['X-Spot-Longitude', '-122.41721'], ['X-Spot-Messenger', 'Where is Andrew'], ['X-Spot-Time', '1483066721']];

const ok: Email = {
  headers: new Map(commonHeaders.concat([['X-Spot-Type', 'Check-in/OK']])),
  subject: 'Check-in/OK message from SPOT Where is Andrew',
  body: fs.readFileSync(path.resolve(__dirname, 'emails', 'ok.txt'), { encoding: 'utf8' }),
  type: 'ok',
};

const help: Email = {
  headers: new Map(commonHeaders.concat([['X-Spot-Type', 'Help']])),
  subject: 'Help message from SPOT Where is Andrew',
  body: fs.readFileSync(path.resolve(__dirname, 'emails', 'help.txt'), { encoding: 'utf8' }),
  type: 'help',
};

const custom: Email = {
  headers: new Map(commonHeaders.concat([['X-Spot-Type', 'Custom']])),
  subject: 'Custom message from SPOT Where is Andrew',
  body: fs.readFileSync(path.resolve(__dirname, 'emails', 'custom.txt'), { encoding: 'utf8' }),
  type: 'custom',
};

const bad: Email = {
  headers: new Map(),
  subject: 'Pictures from my vacation',
  body: 'Thought you’d enjoy these photos of grizzly bears',
  type: 'ok',
}

const runTests = (message: Email) => (t: tape$Context) => {
  const parsed = parseMessage(message.headers, message.body, message.subject);
  t.equal(parsed.time.toUTCString(), 'Fri, 30 Dec 2016 02:58:41 GMT', 'Parses date/time');
  t.equal(parsed.deviceName, 'Where is Andrew', 'Parses device name');
  t.deepEqual(parsed.coordinates, [37.77402, -122.41721], 'Parses coordinates');
  t.equal(parsed.message, 'This is the message.', 'Parses message');
  t.equal(parsed.messageType, message.type, 'Parses message type');
  t.equal(parsed.fullText, message.body, 'Preserves full text under `fullText`');
  t.end();
};

tape('parseMessage: Check-in/OK', runTests(ok));
tape('parseMessage: Custom', runTests(custom));
tape('parseMessage: Help', runTests(help));
tape('parseMessage: Failure Case', t => {
  t.plan(1);
  t.throws(
    parseMessage.bind(this, bad.headers, bad.body, bad.subject),
    /was able to parse/i,
    'Throws an error when the email can’t be parsed'
  );
});