/* @flow */

import get from 'lodash/get';
import type { SpotData } from '../types/spotData';
import type { MessageType } from '../types/messageType';

const subjectMessageTypeMap: { [key: string]: MessageType } = {
  check: 'ok',
  ok: 'ok',
  help: 'help',
  custom: 'custom',
};

export default (body: string, subject: string): SpotData => {
  const trimmed = body.trim();
  const lines = trimmed.split('\n');
  const deviceName = lines[0].trim();
  const latitude = get(trimmed.match(/latitude: *?(-?[0-9]+\.[0-9]+)/i), 1);
  const longitude = get(trimmed.match(/longitude: *?(-?[0-9]+\.[0-9]+)/i), 1);
  const message = (get(trimmed.match(/message:([\s\S]*?)\n\n/i), 1) || '').trim();
  const dateInfo = trimmed.match(/[Dd]ate.*?: *?([-/.: 0-9]+? ([A-Z]{1,5}))/);
  const messageType = subjectMessageTypeMap[
    (get(subject.trim().match(/^[a-z]+/i), 0) || '').toLowerCase()
  ];

  const coordinates = [parseFloat(latitude), parseFloat(longitude)];
  const time = dateInfo ? new Date(dateInfo[1]) : new Date();
  const timeZone = dateInfo ? dateInfo[2] : '';
  
  return {
    time,
    timeZone,
    deviceName,
    coordinates,
    message,
    messageType,
    fullText: trimmed,
  };
};
