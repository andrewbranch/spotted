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

export default (server: any) => {
  server.route({
    method: 'POST',
    path: '/message',
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
          matchRules(message).then(rules => Promise.all(rules.map(rule => (
            formatMessage(rule.messageFormat, message).then(messageString => (
              sendMessage(messageString, rule)
            )).catch(logError)
          )))).then(() => {
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
  });
};
