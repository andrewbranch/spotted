import get from 'lodash/get';
import ary from 'lodash/ary';
import { createHmac } from 'crypto';
import { badRequest, unauthorized } from 'boom';
import logger from '../logger';

const authenticate = ({ signature, timestamp, token }, reply, key) => {
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
  return reply(null, null, { credentials: {} });
};

export default (_, options) => {
  if (options.payload) {
    return {
      authenticate: (request, reply) => reply.continue({ credentials: {} }),
      payload: (request, reply) => authenticate(request.payload || {}, ary(reply, 2), options.key),
      options: { payload: true }
    };
  }

  return {
    authenticate: (request, reply) => authenticate(request.headers, reply, options.key)
  };
}
