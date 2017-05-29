import Hapi from 'hapi';
import GraphQL from 'hapi-graphql';
import RootSchema from './graphql/root';
import messageRoute from './routes/message';
import statusRoute from './routes/status';
import hmacTokenTimeScheme from './auth/hmacTokenTime';
const API_PATH = '/api';
const GRAPHQL_PATH = '/graph';
const PRODUCTION = process.env.NODE_ENV === 'production';
const { MAILGUN_API_KEY, INTERNAL_API_KEY } = process.env;

if (!MAILGUN_API_KEY) {
  throw new Error('MAILGUN_API_KEY was missing from environment');
}

if (!INTERNAL_API_KEY) {
  throw new Error('INTERNAL_API_KEY was missing from environment');
}

export default () => new Promise((resolve, reject) => {
  const server = new Hapi.Server();
  server.connection({ port: process.env.VIRTUAL_PORT });
  server.auth.scheme('hmac-token-time', hmacTokenTimeScheme);
  server.auth.strategy('mailgun', 'hmac-token-time', { key: MAILGUN_API_KEY, payload: true });
  server.auth.strategy('internal', 'hmac-token-time', { key: INTERNAL_API_KEY });
  messageRoute(server, API_PATH);
  statusRoute(server, API_PATH);
  server.register({
    register: GraphQL,
    options: {
      query: {
        schema: RootSchema,
        graphiql: !PRODUCTION,
      },
      route: {
        path: GRAPHQL_PATH,
        config: {
          auth: 'internal',
        },
      },
    },
  }, err => {
    if (err) return reject(err);
    server.start(err => {
      return err ? reject(err) : resolve(server);
    });
  });
});
