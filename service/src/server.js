/* @flow */

import Hapi from 'hapi';
import messageRoute from './routes/message';
import statusRoute from './routes/status';
const BASE_PATH = '/api';

export default () => new Promise((resolve, reject) => {
  const server = new Hapi.Server();
  server.connection({ port: process.env.PORT });
  messageRoute(server, BASE_PATH);
  statusRoute(server, BASE_PATH);
  server.start(err => {
    return err ? reject(err) : resolve(server);
  });
});
