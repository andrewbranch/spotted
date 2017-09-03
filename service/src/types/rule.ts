import { Schema } from 'mongoose';
import { MessageType } from './messageType';
import { Recipient } from './recipient';

export interface Rule {
  messageType: MessageType;
  messageFormat: string;
  enabled: boolean;
  recipients: Recipient[] | Schema.Types.ObjectId[] | string[];
};

export interface PopulatedRule extends Rule {
  recipients: Recipient[];
};
