/* @flow */

import type { Coordinates } from './coordinates';
import type { MessageType } from  './messageType';

export interface SpotData {
  time: Date;
  coordinates: Coordinates;
  message: string;
  messageType: MessageType;
  fullText: string;
}
