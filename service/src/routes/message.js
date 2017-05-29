import get from 'lodash/get';
import flatten from 'lodash/flatten';
import compact from 'lodash/compact';
import parseMessage from '../utils/parseMessage';
import formatMessage from '../utils/formatMessage';
import matchRules from '../utils/matchRules';
import sendMessage from '../utils/sendMessage';
import logger from '../logger';

const logError = (err: Error) => {
  logger.error(err.stack);
  return err;
};

const fail = (err: Error, response: any) => {
  logger.error('Failed to parse message.', err.message);
  logger.silly(err.stack);
  response.statusCode = 400;
  response.send();
};

export default (server: any, basePath: string) => {
  server.route({
    method: 'POST',
    path: `${basePath}/message`,
    config: {
      auth: 'mailgun',
      handler: (request, reply) => {
        const emailText = get(request, 'payload.body-plain');
        const emailSubject = get(request, 'payload.subject');
        const emailHeaders = get(request, 'payload.message-headers');
        logger.verbose('Processing request...');
        if (emailText && emailSubject && emailHeaders) {
          const response = reply().hold();
          try {
            logger.verbose('Parsing message...');
            const message = parseMessage(new Map(JSON.parse(emailHeaders)), emailText, emailSubject);
            logger.silly('Parsed message:', message);
            logger.verbose('Finding matching rules...');
            matchRules(message).then(rules => {
              return Promise.all(rules.map(rule => {
                logger.verbose(`Rule matched. Formatting ${rule.messageType} message for ${rule.recipients.length} recipients.`);
                logger.silly(rule);
                return Promise.all(rule.recipients.map(recipient => formatMessage(rule.messageFormat, recipient, message).then(messageString => {
                  logger.verbose('Formatted message');
                  logger.silly(messageString);
                  return sendMessage(messageString, recipient);
                }).catch(logError)));
              })).then(resolutions => {
                const attemptedMessages = flatten(resolutions);
                const errors = compact(attemptedMessages);
                logger.verbose(`Request complete. Sent ${attemptedMessages.length - errors.length} messages, and failed to send ${errors.length} messages.`);
                response.send();
              });
            }).catch(err => {
              fail(err, response);
            });
          } catch (err) {
            fail(err, response);
          }
        } else {
          logger.error('POST /message did not have a properly formatted payload', request.payload);
          reply(new Error('payload was missing not properly formatted'));
        }
      },
    },
  });
};
