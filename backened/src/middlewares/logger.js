// const { createLogger, transports, format } = require('winston');

// const logger = createLogger({
//   level: 'info',
//   format: format.combine(
//     format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
//   ),
//   transports: [
//     new transports.Console(),                 
//     new transports.File({ filename: 'logs/app.log' })
//   ],
// });

// module.exports = logger;

const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    // In development, use console + file
    ...(process.env.NODE_ENV !== 'production'
      ? [new transports.File({ filename: 'logs/app.log' })]
      : []),

    // Always use console in production (Vercel)
    new transports.Console()
  ]
});

module.exports = logger;
