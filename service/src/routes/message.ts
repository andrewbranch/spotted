import { get, flatten, compact } from 'lodash';
import { Server } from 'hapi';
import processMessageRequest from './lib/processMessageRequest';
import logger from '../logger';

export default (server: Server, basePath: string) => {
  server.route({
    method: 'POST',
    path: `${basePath}/message`,
    config: {
      auth: 'mailgun',
      handler: async (request, reply) => {
        const emailText = get<string>(request, 'payload.body-plain');
        const emailSubject = get<string>(request, 'payload.subject');
        const emailHeaders = get<string>(request, 'payload.message-headers');
        logger.verbose('Processing request...');
        if (emailText && emailSubject && emailHeaders) {
          const response = reply().hold();
          try {
            await processMessageRequest(emailHeaders, emailText, emailSubject);
            response.send();
          } catch (err) {
            logger.error('Failed to parse message.', err.message);
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
