import { createHmac } from 'crypto';
import { badRequest, unauthorized } from 'boom';
import logger from '../logger';

export default (_, options) => ({
  authenticate(request, reply) {
    logger.verbose('Authenticating request with mailgun scheme...');
    const { signature, timestamp, token } = request.headers;
    if (!signature || !timestamp || !token) {
      return reply(badRequest('Authentication headers missing'));
    }

    if (Date.now() - parseInt(timestamp) * 1000 > 30 * 1000) {
      return reply(badRequest('Request timestamp is too old'));
    }

    const hmac = createHmac('sha256', options.key);
    hmac.update(`${timestamp}${token}`);
    if (hmac.digest('hex') !== signature) {
      return reply(unauthorized('Authentication token was invalid'));
    }

    logger.verbose('Successfully authenticated request with mailgun scheme');
    return reply.continue({ credentials: null });
  },
});
