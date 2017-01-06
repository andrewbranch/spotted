/* @flow */

import get from 'lodash/get';
import type { SpotData } from '../types/spotData';
import type { MessageType } from '../types/messageType';

const subjectMessageTypeMap: { [key: string]: MessageType } = {
  'Check-in/OK': 'ok',
  'Help': 'help',
  'Custom': 'custom',
};

export default (
  headers: Map<string, string>,
  body: string,
  subject: string
): SpotData => {
  const trimmed = body.trim();
  const deviceName = headers.get('X-Spot-Messenger') || '';
  const latitude = parseFloat(headers.get('X-Spot-Latitude'));
  const longitude = parseFloat(headers.get('X-Spot-Longitude'));
  const time = new Date(parseInt(headers.get('X-Spot-Time')) * 1000);
  const messageType = subjectMessageTypeMap[headers.get('X-Spot-Type') || ''];
  const message = (get(trimmed.match(/message:([\s\S]*?)\n\n/i), 1) || '').trim();
  
  return {
    time,
    deviceName,
    message,
    messageType,
    coordinates: [latitude, longitude],
    fullText: trimmed,
  };
};
