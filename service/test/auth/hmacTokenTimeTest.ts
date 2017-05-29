import * as tk from 'timekeeper';
import * as tape from 'tape';
import { when, matchers, verify, function as fn } from 'testdouble';
import hmacTokenTimeScheme from '../../src/auth/hmacTokenTime';

const { MAILGUN_API_KEY } = process.env;
if (!MAILGUN_API_KEY) throw new Error('MAILGUN_API_KEY was missing from environment');
const { authenticate } = hmacTokenTimeScheme(null, { key: MAILGUN_API_KEY });

const missingHeaders = {};

const invalidHeaders = {
  token: 'asdfasdfa',
  timestamp: (Date.now() / 1000).toFixed(0),
  signature: 'johnhancock',
};

const validHeaders = {
  token: 'dec5d83d15373a076bc259078586859b875bde0211d04d479e',
  timestamp: '1485043736',
  signature: '4f65de4440efa7c34bc1f8e105ef37e8f2c63e4557fe8cf09272cdc42b3f1d49',
};

const statusCode = code => matchers.argThat(x => x.output.statusCode === code);
const reply = fn('reply') as Function & { continue: Function };
reply.continue = fn('continue');

when(reply(), { ignoreExtraArgs: true }).thenResolve(null);
when(reply.continue(), { ignoreExtraArgs: true }).thenResolve(null);

tape('hmacTokenTime auth scheme', async t => {
  await authenticate({ headers: missingHeaders }, reply);
  t.doesNotThrow(() => verify(reply(statusCode(400)), { times: 1 }), 'auth fails with 400 for missing headers');
  
  await authenticate({ headers: invalidHeaders }, reply);
  t.doesNotThrow(() => verify(reply(statusCode(401))), 'auth fails with 401 for invalid headers');
  
  await authenticate({ headers: validHeaders }, reply);
  t.doesNotThrow(() => verify(reply(statusCode(400)), { times: 2 }), 'auth fails if timestamp is old');
  
  tk.travel(parseInt(validHeaders.timestamp) * 1000);
  await authenticate({ headers: validHeaders }, reply);
  t.doesNotThrow(() => verify(reply.continue({ credentials: {} })), 'auth succeeds with valid headers');
  tk.reset();
  t.end();
});
