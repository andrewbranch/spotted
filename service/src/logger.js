/* @flow */

import winston from 'winston';

winston.configure({
  level: process.env.LOG_LEVEL,
});

export default winston;
