/* @flow */

import parseMessage from '../utils/parseMessage';
import formatMessage from '../utils/formatMessage';
import matchRules from '../utils/matchRules';

interface MessageRequest {
  payload?: {
    message?: string;
  };
  [key: string]: any;
}

export default (server: any) => {
  server.route({
    method: 'POST',
    path: '/message',
    handler: (request: MessageRequest, reply) => {
      if (request.payload && request.payload.message) {
        const message = parseMessage(request.payload.message);
        matchRules(message).then(rules => {
          
        });
      }
    },
  });
};
