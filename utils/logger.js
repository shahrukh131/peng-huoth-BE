const winston = require('winston');
require('winston-daily-rotate-file');

// Define log file options
const logTransport = new winston.transports.DailyRotateFile({
  filename: 'logs/%DATE%-app.log',
  datePattern: 'YYYY-MM-DD', 
  maxFiles: '14d', 
  level: 'info', 
});

// Create the winston logger
const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.colorize({
        all: true,
        colors: {
          info: 'green',
          warn: 'yellow',
          error: 'red',
          debug: 'blue',
        },
      }), 

    winston.format.cli()
  ),
  transports: [
    new winston.transports.Console(), 
    logTransport, 
  ],
});

module.exports = logger;
