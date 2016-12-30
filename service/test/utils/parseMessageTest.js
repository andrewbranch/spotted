/* @flow */

import type { SpotData } from '../../src/types/spotData';
import type { MessageType } from '../../src/types/messageType';
import tape from 'tape';
import parseMessage from '../../src/utils/parseMessage';
import fs from 'fs';
import path from 'path';

type Email = {
  subject: string;
  body: string;
  type: MessageType;
};

const ok: Email = {
  subject: 'Check-in/OK message from SPOT Where is Andrew',
  body: fs.readFileSync(path.resolve(__dirname, 'emails', 'ok.txt'), { encoding: 'utf8' }),
  type: 'ok',
};

const help: Email = {
  subject: 'Help message from SPOT Where is Andrew',
  body: fs.readFileSync(path.resolve(__dirname, 'emails', 'help.txt'), { encoding: 'utf8' }),
  type: 'help',
};

const custom: Email = {
  subject: 'Custom message from SPOT Where is Andrew',
  body: fs.readFileSync(path.resolve(__dirname, 'emails', 'custom.txt'), { encoding: 'utf8' }),
  type: 'custom',
};

const runTests = (message: Email) => (t: tape$Context) => {
  const parsed = parseMessage(message.body, message.subject);
  t.equal(parsed.time.toUTCString(), 'Fri, 30 Dec 2016 02:58:41 GMT', 'Parses date/time');
  t.equal(parsed.timeZone, 'PST', 'Parses time zone');
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
