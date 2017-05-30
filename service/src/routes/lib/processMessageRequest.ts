import { flatten, compact } from 'lodash';
import logger from '../../logger';
import parseMessage from '../../utils/parseMessage';
import formatMessage from '../../utils/formatMessage';
import matchRules from '../../utils/matchRules';
import sendMessage from '../../utils/sendMessage';

const logError = (err: Error) => {
  logger.error(err.stack);
  return err;
};

export default async (emailHeaders: string, emailText: string, emailSubject: string) => {
  logger.verbose('Parsing message...');
  const message = parseMessage(new Map<string, string>(JSON.parse(emailHeaders)), emailText, emailSubject);
  logger.silly('Parsed message:', message);
  logger.verbose('Finding matching rules...');
  const rules = await matchRules(message);
  await Promise.all(rules.map(rule => {
    logger.verbose(`Rule matched. Formatting ${rule.messageType} message for ${rule.recipients.length} recipients.`);
    logger.silly('Rule:', rule);
    return Promise.all(rule.recipients.map(recipient => formatMessage(rule.messageFormat, message, recipient).then(messageString => {
      logger.verbose('Formatted message');
      logger.silly(messageString);
      return sendMessage(messageString, recipient);
    }).catch(logError)));
  })).then(resolutions => {
    const attemptedMessages = flatten(resolutions);
    const errors = compact(attemptedMessages);
    logger.verbose(`Request complete. Sent ${attemptedMessages.length - errors.length} messages, and failed to send ${errors.length} messages.`);
  });
}