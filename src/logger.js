const { createLogger, format, transports } = require('winston');
const util = require('util');

function transform(info) {
  const information = info;
  const args = info[Symbol.for('splat')];
  if (args) {
    information.message = util.format(info.message, ...args);
  }
  return information;
}

function utilFormatter() { return { transform }; }
const errorStackFormat = format((info) => {
  if (info instanceof Error) {
    return {
      ...info,
      stack: info.stack,
      message: info.message,
    };
  }
  return info;
});

module.exports = (() => {
  const logger = createLogger({
    level: 'debug',
    format: format.combine(
      errorStackFormat(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
      utilFormatter(), // <-- this is what changed
      format.colorize(),
      format.printf(({
        level, message, label, timestamp,
      }) => `${timestamp} ${label || '-'} ${level}: ${message}`),
    ),
    transports: [
      new transports.File({ filename: 'error.log', level: 'error', handleExceptions: true }),
      new transports.File({ filename: 'combined.log', handleExceptions: true }),
    ],

  });

  logger.rejections.handle(
    new transports.File({ filename: 'rejections.log' }),
  );

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
      handleExceptions: true,
      handleRejections: true,
    }));
  }

  return logger;
})();
