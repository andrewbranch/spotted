/* @flow */

import Hapi from 'hapi';
import messageRoute from './routes/message';
import statusRoute from './routes/status';
import mailgunScheme from './auth/mailgun';
const BASE_PATH = '/api';

export default () => new Promise((resolve, reject) => {
  const server = new Hapi.Server();
  server.connection({ port: process.env.VIRTUAL_PORT });
  messageRoute(server, BASE_PATH);
  statusRoute(server, BASE_PATH);
  server.auth.scheme('mailgun', mailgunScheme);
  server.auth.strategy('mailgun', mailgunScheme);
  server.start(err => {
    return err ? reject(err) : resolve(server);
  });
});
