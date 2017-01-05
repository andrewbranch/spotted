/* @flow */
import packageJSON from '../../package.json';

export default (server: any) => {
  server.route({
    method: 'GET',
    path: '/status',
    handler: (_, reply) => {
      reply({ version: packageJSON.version });
    },
  });
};
