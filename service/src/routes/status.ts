const packageJSON = require('../../package.json');

export const statusRoute = (server: any, basePath: string) => {
  server.route({
    method: 'GET',
    path: `${basePath}/status`,
    handler: (_, reply) => {
      reply({ version: packageJSON.version });
    },
  });
};
