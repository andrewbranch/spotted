/* @flow */

import Hapi from 'hapi';
import messageRoute from './routes/message';

export default () => new Promise((resolve, reject) => {
  const server = new Hapi.Server();
  server.connection({ port: process.env.PORT });
  messageRoute(server);
  server.start(err => {
    return err ? reject(err) : resolve(server);
  });
});
