import { SpotMessage } from '../models';
import { SpotMessage as ISpotMessage } from '../types';
export const WITHIN_METERS = 16e3; // 16 km ~= 10 mi
export const WITHIN_MILLISECONDS = 1.5 * 60 * 60 * 1000; // 1 hr 30 min

export const findDuplicateMessages = (message: ISpotMessage) => (
  SpotMessage.find({
    deviceName: message.deviceName,
    messageType: message.messageType,
    message: message.message,
    time: { $gt: message.time.getTime() - WITHIN_MILLISECONDS }
  }).where('location').within({
    center: [message.coordinates[1], message.coordinates[0]],
    radius: WITHIN_METERS
  }).exec()
);
