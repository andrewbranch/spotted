/* @flow */

import parseMessage from '../utils/parseMessage';
import formatMessage from '../utils/formatMessage';
import matchRules from '../utils/matchRules';
import sendMessage from '../utils/sendMessage';
import logger from '../logger';

interface MessageRequest {
  payload: {
    message?: string;
  };
  [key: string]: any;
}

const logError = (err: Error) => {
  logger.error(err.stack);
};

export default (server: any) => {
  server.route({
    method: 'POST',
    path: '/message',
    handler: (request: MessageRequest, reply) => {
      const emailText = request.payload.message;
      if (emailText) {
        const response = reply().hold();
        const message = parseMessage(emailText);
        matchRules(message).then(rules => Promise.all(rules.map(rule => (
          formatMessage(rule, message).then(messageString => (
            sendMessage(messageString, rule)
          )).catch(logError)
        )))).then(() => {
          response.statusCode = 201;
          response.send();
        });
      } else {
        logger.error('POST /message did not have a properly formatted payload');
        reply(new Error('payload was missing not properly formatted'));
      }
    },
  });
};
