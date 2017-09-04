import { flatten, compact } from 'lodash';
import { SpotMessage } from '../../models';
import { parseMessage, formatMessage, matchRules, sendMessage, findDuplicateMessages } from '../../utils';
import logger from '../../logger';

const logError = (err: Error) => {
  logger.error(err.stack);
  return err;
};

export const processMessageRequest = async (emailHeaders: string, emailText: string) => {
  logger.verbose('Parsing message...');
  const message = parseMessage(new Map<string, string>(JSON.parse(emailHeaders)), emailText);
  logger.silly('Parsed message:', message);

  const duplicates = await findDuplicateMessages(message);
  if (duplicates.length) {
    logger.verbose(`Message was determined to be a duplicate in a series of ${duplicates.length + 1}. Aborting.`);
    return;
  }

  logger.verbose('Saving message...');
  await SpotMessage.saveMessage(message);
  logger.verbose('Saved message. Finding matching rules...');
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