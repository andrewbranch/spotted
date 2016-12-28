/* @flow */

import Hapi from 'hapi';

export default () => new Promise((resolve, reject) {
  const server = new Hapi.Server();
  server.connection({ port: process.env.PORT });
  server.start(err => {
    return err ? reject(err) : resolve(server);
  });
});
