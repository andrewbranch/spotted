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
            matchRules(message).then(rules => Promise.all(rules.map(rule => {
              logger.verbose(`Rule matched. Formatting ${rule.messageType} message for ${rule.recipients.length} recipients.`);
              logger.silly(rule);
              formatMessage(rule.messageFormat, message).then(messageString => {
                logger.verbose('Formatted message');
                logger.silly(messageString);
                sendMessage(messageString, rule);
              }).catch(logError);
            }))).then(resolutions => {
              logger.verbose(`Request complete. Sent ${resolutions.length} messages.`);
              response.send();
            });
          } catch (err) {
            logger.error('Failed to parse message.');
            logger.silly(err.stack);
            response.statusCode = 400;
            response.send();
          }
        } else {
          logger.error('POST /message did not have a properly formatted payload', request.payload);
          reply(new Error('payload was missing not properly formatted'));
        }
      },
    },
  });
};
