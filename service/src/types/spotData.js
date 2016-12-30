/* @flow */

import type { Coordinates } from './coordinates';
import type { MessageType } from  './messageType';

export interface SpotData {
  time: Date;
  timeZone: string;
  deviceName: string;
  coordinates: Coordinates;
  message: string;
  messageType: MessageType;
  fullText: string;
}
