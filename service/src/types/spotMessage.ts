import { Coordinates } from './coordinates';
import { MessageType } from  './messageType';

export interface SpotMessage {
  time: Date;
  deviceName: string;
  coordinates: Coordinates;
  message: string;
  messageType: MessageType;
  fullText: string;
}
