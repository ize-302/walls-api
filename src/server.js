
import express from 'express';
const app = express()
import bodyParser from "body-parser";
import swaggerUi from 'swagger-ui-express';
import cors from 'cors'
import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';
import onFinished from 'on-finished'

import { BASE_PATH, PORT, NODE_ENV } from './config.js';
import mainRoute from './routes/index.js'
import loggerMiddleware from './middlewares/logger/dev-logger.middleware.js';
import swaggerDocs from './swagger.js';
import sessionMiddleware from "./middlewares/session.middleware.js";

// setup CORS logic
app.use(cors({ origin: 'http://127.0.0.1:8000', credentials: true }));

// Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// session middleware logic
app.use(sessionMiddleware);

// logger info for every request
if (NODE_ENV !== 'testing') {
  app.use((req, res, next) => {
    onFinished(res, function () {
      if (res.statusCode >= 500 && res.statusCode <= 599) {
        // error(0)
        loggerMiddleware.error(`Received a ${req.method} request for ${req.url}`);
      } else if (res.statusCode >= 400 && res.statusCode <= 409 && res.statusCode !== 404) {
        // warn(1)
        loggerMiddleware.warn(`Received a ${req.method} request for ${req.url} - ${res.statusMessage}`);
      } else if (res.statusCode >= 200 && res.statusCode <= 299) {
        // info(2)
        loggerMiddleware.info(`Received a ${req.method} request for ${req.url}`);
      } else if ((res.statusCode >= 100 && res.statusCode <= 199) || (res.statusCode >= 300 && res.statusCode <= 399)) {
        // http(3)
        loggerMiddleware.http(`Received a ${req.method} request for ${req.url}`);
      } else if (res.statusCode === 404) {
        // verbose(4)
        loggerMiddleware.verbose(`Received a ${req.method} request for ${req.url}`);
      }
    })
    next();
  });
}

app.use(BASE_PATH, mainRoute);
app.use(`${BASE_PATH}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (_, res) => res.redirect(BASE_PATH))

app.get('*', function (req, res) {
  res.status(StatusCodes.NOT_FOUND).json({ success: false, message: ReasonPhrases.NOT_FOUND });
});

if (NODE_ENV !== 'testing') {
  app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })
}

export default app