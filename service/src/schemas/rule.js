/* @flow */

import mongoose from 'mongoose';
import messageTypes from '../utils/messageTypes';
const { ObjectId } = mongoose.Schema.Types;

export default mongoose.Schema({
  recipients: [{ type: ObjectId, ref: 'Recipient' }],
  messageType: { type: String, enum: messageTypes, required: true },
  messageFormat: { type: String, required: true },
  enabled: { type: Boolean, required: true, default: false },
});
