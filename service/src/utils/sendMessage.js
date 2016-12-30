/* @flow */

import type { PopulatedRule } from '../models/rule';
import type { Model } from '../types/mongoose';
import twilio from 'twilio';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE } = process.env;
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE) {
  throw new Error('Twilio credentials missing from enviornment');
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export default (message: string, rule: Model<PopulatedRule>): Promise<mixed> => {
  return Promise.all(rule.recipients.map(recipient => new Promise((resolve, reject) => {
    client.sendMessage({
      to: recipient.phone,
      from: TWILIO_PHONE,
      body: message,
    }, err => {
      return err ? reject(err) : resolve();
    });
  })));
};