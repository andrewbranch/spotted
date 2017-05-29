import { Logger, transports } from 'winston';
export default new Logger({
  transports: [new transports.Console({ level: process.env.LOG_LEVEL })]
});
