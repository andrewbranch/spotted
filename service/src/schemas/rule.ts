import * as mongoose from 'mongoose';
import { MessageType } from '../types/messageType';
const { ObjectId } = mongoose.Schema.Types;
const messageTypes: MessageType[] = ['ok', 'custom', 'help'];

export default new mongoose.Schema({
  recipients: [{ type: ObjectId, ref: 'Recipient' }],
  messageType: { type: String, enum: messageTypes, required: true },
  messageFormat: { type: String, required: true },
  enabled: { type: Boolean, required: true, default: false },
});
