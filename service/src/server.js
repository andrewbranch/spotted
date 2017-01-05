/* @flow */

import Hapi from 'hapi';
import messageRoute from './routes/message';
import statusRoute from './routes/status';

export default () => new Promise((resolve, reject) => {
  const server = new Hapi.Server();
  server.connection({ port: process.env.PORT });
  messageRoute(server);
  statusRoute(server);
  server.start(err => {
    return err ? reject(err) : resolve(server);
  });
});
