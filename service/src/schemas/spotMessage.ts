import * as mongoose from 'mongoose';
import { MessageType, SpotMessage } from '../types';
const { ObjectId } = mongoose.Schema.Types;
const messageTypes: MessageType[] = ['ok', 'custom', 'help'];

const schema = {
  time: { type: Date, required: true },
  deviceName: { type: String, required: true },
  location: {
    type: { type: String, enum: 'Point', default: 'Point', required: true },
    coordinates: { type: [Number], required: true },
  },
  message: { type: String, required: true },
  messageType: { type: String, enum: messageTypes, required: true },
  fullText: { type: String, required: true }
};

export const spotMessageStatics = {
  saveMessage(this: mongoose.Model<mongoose.Document & SpotMessage>, message: SpotMessage) {
    return this.create({
      ...message,
      coordinates: {
        type: 'Point',
        coordinates: [message.coordinates[1], message.coordinates[0]]
      }
    });
  }
};

const SpotMessageSchema = new mongoose.Schema(schema);
Object.assign(SpotMessageSchema.statics, spotMessageStatics);
SpotMessageSchema.index({ coordinates: '2dsphere' });

// Mongoose stores lat/lng backwards (i.e., [lng, lat])
SpotMessageSchema.virtual('coordinates').get(function() {
  return [this.coordinates.coordinates[1], this.coordinates.coordinates[0]];
});

export { SpotMessageSchema };
