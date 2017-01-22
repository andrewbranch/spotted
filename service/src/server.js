/* @flow */

import Hapi from 'hapi';
import GraphQL from 'hapi-graphql';
import RootSchema from './graphql/root';
import messageRoute from './routes/message';
import statusRoute from './routes/status';
import mailgunScheme from './auth/mailgun';
const API_PATH = '/api';
const GRAPHQL_PATH = '/graph';
const PRODUCTION = process.env.NODE_ENV === 'production';

export default () => new Promise((resolve, reject) => {
  const server = new Hapi.Server();
  server.connection({ port: process.env.VIRTUAL_PORT });
  server.auth.scheme('mailgun', mailgunScheme);
  server.auth.strategy('mailgun', 'mailgun');
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
        config: {},
      },
    },
  }, err => {
    if (err) return reject(err);
    server.start(err => {
      return err ? reject(err) : resolve(server);
    });
  });
});
