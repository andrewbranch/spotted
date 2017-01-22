import tk from 'timekeeper';
import tape from 'tape';
import td, { when, matchers, verify } from 'testdouble';
import mailgunScheme from '../../src/auth/mailgun';

const { authenticate } = mailgunScheme();

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
const reply = td.function('reply');
reply.continue = td.function('continue');

when(reply(), { ignoreExtraArgs: true }).thenResolve();
when(reply.continue(), { ignoreExtraArgs: true }).thenResolve();

tape('mailgun auth scheme', async t => {
  await authenticate({ headers: missingHeaders }, reply);
  t.doesNotThrow(() => verify(reply(statusCode(400)), { times: 1 }), 'auth fails with 400 for missing headers');
  
  await authenticate({ headers: invalidHeaders }, reply);
  t.doesNotThrow(() => verify(reply(statusCode(401))), 'auth fails with 401 for invalid headers');
  
  await authenticate({ headers: validHeaders }, reply);
  t.doesNotThrow(() => verify(reply(statusCode(400)), { times: 2 }), 'auth fails if timestamp is old');
  
  tk.travel(parseInt(validHeaders.timestamp) * 1000);
  await authenticate({ headers: validHeaders }, reply);
  t.doesNotThrow(() => verify(reply.continue({ credentials: null })), 'auth succeeds with valid headers');
  tk.reset();
  t.end();
});
