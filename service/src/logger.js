/* @flow */

import winston from 'winston';
winston.level = process.env.LOG_LEVEL;
export default winston;
