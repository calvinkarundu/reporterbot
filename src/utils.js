import path from 'path';
import config from 'config';
import bunyan from 'bunyan';
import bunyanRequestLogger from 'bunyan-request-logger';
import morgan from 'morgan';
import tracer from 'tracer';

export const ERROR_START = 15;

export const log = (() => {
  let logger;

  if (config.get('logging.console')) {
    logger = process.env.NODE_ENV === 'test'
      ? console
      : tracer.colorConsole();
    logger.requestLogger = morgan('dev');
  } else {
    const logPath = config.get('logging.path');
    logger = bunyan.createLogger({
      name: 'reporterbot',
      streams: [{
        level: 'info',
        path: path.join(logPath, 'info.log'),
      }, {
        level: 'error',
        path: path.join(logPath, 'error.log'),
      }],
    });

    logger.requestLogger = bunyanRequestLogger({
      name: 'reporterbot',
      streams: [{
        level: 'info',
        path: path.join(logPath, 'http.info.log'),
      }, {
        level: 'error',
        path: path.join(logPath, 'http.error.log'),
      }],
    }).requestLogger();
  }

  return logger;
})();

export function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
