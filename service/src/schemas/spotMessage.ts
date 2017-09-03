import * as mongoose from 'mongoose';
import { MessageType, SpotMessage } from '../types';
const { ObjectId } = mongoose.Schema.Types;
const messageTypes: MessageType[] = ['ok', 'custom', 'help'];

const schema: { [key in keyof SpotMessage]: any } = {
  time: { type: Date, required: true },
  deviceName: { type: String, required: true },
  coordinates: {
    type: { type: String, enum: 'Point', default: 'Point', required: true },
    coordinates: { type: [Number], required: true },
  },
  message: { type: String, required: true },
  messageType: { type: String, enum: messageTypes, required: true },
  fullText: { type: String, required: true }
};

export default new mongoose.Schema(schema);
