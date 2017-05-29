import { Recipient } from '../models/recipient';
import * as twilio from 'twilio';

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE } = process.env;
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE) {
  throw new Error('Twilio credentials missing from enviornment');
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export default (message: string, recipient: Recipient) => {
  return new Promise<void>((resolve, reject) => {
    client.sendMessage({
      to: recipient.phone,
      from: TWILIO_PHONE,
      body: message,
    }, err => {
      return err ? reject(err) : resolve();
    });
  });
};
