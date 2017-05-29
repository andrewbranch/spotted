import { Coordinates } from './coordinates';
import { MessageType } from  './messageType';

export interface SpotData {
  time: Date;
  deviceName: string;
  coordinates: Coordinates;
  message: string;
  messageType: MessageType;
  fullText: string;
}
