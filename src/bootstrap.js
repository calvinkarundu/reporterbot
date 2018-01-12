import bodyParser from 'body-parser';

import { log } from './utils';
import router from './routes';

export default function (app) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Routes
  app.use(router);

  // 404
  app.use((req, res) => {
    res.status(404).send({
      status: 404,
      message: 'The requested resource was not found',
    });
  });

  // 5xx
  app.use((err, req, res) => {
    log.error(err.stack);

    const message = process.env.NODE_ENV === 'production'
      ? 'Something went wrong, we\'re looking into it...'
      : err.stack;

    res.status(500).send({
      status: 500,
      message,
    });
  });
}
