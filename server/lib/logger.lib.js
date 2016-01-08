import winston from 'winston';

const info  = '/home/deploy/wordswithstrangers/logs/info.txt';
const error = '/home/deploy/wordswithstrangers/logs/error.txt';

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({
      name:     'info-file',
      filename: info,
      level:    'info'
    }),
    new (winston.transports.File)({
      name:     'error-file',
      filename: error,
      level:    'error'
    })
  ]
});

export default logger;
