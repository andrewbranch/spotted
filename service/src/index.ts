import connectDatabase from './db';
import startServer from './server';
import logger from './logger';

connectDatabase().then(() => {
  logger.info('Database connected');
});

startServer().then(server => {
  logger.info(`Server running on port ${server.info.port}`);
});
