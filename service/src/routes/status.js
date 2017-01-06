/* @flow */
import packageJSON from '../../package.json';

export default (server: any, basePath: string) => {
  server.route({
    method: 'GET',
    path: `${basePath}/status`,
    handler: (_, reply) => {
      reply({ version: packageJSON.version });
    },
  });
};
