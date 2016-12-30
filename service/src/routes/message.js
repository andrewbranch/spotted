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
      const emailText = get(request, 'payload.message.body-plain');
      const emailSubject = get(request, 'payload.message.subject');
      if (emailText) {
        const response = reply().hold();
        const message = parseMessage(emailText, emailSubject);
        matchRules(message).then(rules => Promise.all(rules.map(rule => (
          formatMessage(rule, message).then(messageString => (
            sendMessage(messageString, rule)
          )).catch(logError)
        )))).then(() => {
          response.send();
        });
      } else {
        logger.error('POST /message did not have a properly formatted payload');
        reply(new Error('payload was missing not properly formatted'));
      }
    },
  });
};
