const { createLogger, format, transports } = require('winston');

module.exports = (() => {
  const logger = createLogger({
    format: format.json(),
    defaultMeta: { service: 'user-service' },
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
      format: format.simple(),
      handleExceptions: true,
      handleRejections: true,
    }));
  }

  return logger;
})();
