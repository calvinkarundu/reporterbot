import path from 'path';
import config from 'config';
import morgan from 'morgan';
import mkdirp from 'mkdirp';
import tracer from 'tracer';

export const ERROR_START = 15;

export const log = (() => {
  const logger = tracer.colorConsole();
  logger.requestLogger = morgan('dev');
  return logger;
})();

export const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

export const delay = time => new Promise((resolve) => {
  setTimeout(() => { resolve(); }, time);
});

export const getReportFilesDir = () => {
  let reportFilesDir;
  try {
    reportFilesDir = path.join(__dirname, `../${config.get('reportFilesDir')}`);
    mkdirp.sync(reportFilesDir);
    return reportFilesDir;
  } catch (err) {
    throw err;
  }
};
