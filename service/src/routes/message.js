/* @flow */

import get from 'lodash/get';
import parseMessage from '../utils/parseMessage';
import formatMessage from '../utils/formatMessage';
import matchRules from '../utils/matchRules';
import sendMessage from '../utils/sendMessage';
import logger from '../logger';

const logError = (err: Error) => {
  logger.error(err.stack);
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
                return formatMessage(rule.messageFormat, message).then(messageString => {
                  logger.verbose('Formatted message');
                  logger.silly(messageString);
                  return sendMessage(messageString, rule);
                }).catch(logError);
              })).then(() => {
                const messageCount = rules.reduce((n, rule) => n + rule.recipients.length, 0);
                logger.verbose(`Request complete. Sent ${messageCount} messages.`);
                response.send();
              });
            }).catch(err => {
              fail(err, response);
            })
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
