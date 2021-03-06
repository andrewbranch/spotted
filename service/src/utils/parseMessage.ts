import { get } from 'lodash';
import * as assert from 'assert';
import { SpotMessage, MessageType } from '../types';

const subjectMessageTypeMap: { [key: string]: MessageType } = {
  'Check-in/OK': 'ok',
  'Help': 'help',
  'Custom': 'custom',
};

export const parseMessage = (
  headers: Map<string, string>,
  body: string
): SpotMessage => {
  const trimmed = body.trim();
  const deviceName = headers.get('X-Spot-Messenger') || '';
  assert.ok(deviceName, 'was able to parse deviceName');
  const latitude = parseFloat(headers.get('X-Spot-Latitude'));
  assert.ok(latitude, 'was able to parse latitude');
  const longitude = parseFloat(headers.get('X-Spot-Longitude'));
  assert.ok(longitude, 'was able to parse longitude');
  const time = new Date(parseInt(headers.get('X-Spot-Time')) * 1000);
  assert.ok(!isNaN(time.getTime()));
  const messageType = subjectMessageTypeMap[headers.get('X-Spot-Type') || ''];
  assert.ok(messageType, 'was able to parse messageType');
  const message = (get<string>(trimmed.match(/message:([\s\S]*?)\n\n/i), 1) || '').trim();
  
  return {
    time,
    deviceName,
    message,
    messageType,
    coordinates: [latitude, longitude],
    fullText: trimmed,
  };
};
