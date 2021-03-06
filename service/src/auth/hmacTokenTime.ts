import { get } from 'lodash';
import { createHmac } from 'crypto';
import { badRequest, unauthorized } from 'boom';
import logger from '../logger';

const authenticate = ({ signature, timestamp, token }, reply, key, ...continueArgs) => {
  logger.verbose('Authenticating request with mailgun scheme...');
  if (!signature || !timestamp || !token) {
    return reply(badRequest('Authentication headers missing'));
  }

  if (Date.now() - parseInt(timestamp) * 1000 > 30 * 1000) {
    return reply(badRequest('Request timestamp is too old'));
  }

  const hmac = createHmac('sha256', key);
  hmac.update(`${timestamp}${token}`);
  if (hmac.digest('hex') !== signature) {
    return reply(unauthorized('Authentication token was invalid'));
  }

  logger.verbose('Successfully authenticated request with mailgun scheme');
  return reply.continue(...continueArgs);
};

export const hmacTokenTimeScheme = (_, options) => {
  if (options.payload) {
    return {
      authenticate: (request, reply) => reply.continue({ credentials: {} }),
      payload: (request, reply) => authenticate(request.payload || {}, reply, options.key),
      options: { payload: true }
    };
  }

  return {
    authenticate: (request, reply) => authenticate(request.headers, reply, options.key, { credentials: {} })
  };
}
