
import express from 'express';
const app = express()
import bodyParser from "body-parser";
import swaggerUi from 'swagger-ui-express';
import cors from 'cors'

import { BASE_PATH, PORT } from './config.js';
import mainRoute from './routes/index.js'
import loggerMiddleware from './middlewares/logger.middleware.js';
import swaggerDocs from './swagger.js';
import sessionMiddleware from "./middlewares/session.middleware.js";

// setup CORS logic
app.use(cors());

// Bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// session middleware logic
app.use(sessionMiddleware);

// logger info for every request
app.use((req, res, next) => {
  loggerMiddleware.info(`Received a ${req.method} request for ${req.url}`);
  next();
});

app.use(BASE_PATH, mainRoute);
app.use(`${BASE_PATH}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (_, res) => res.redirect(BASE_PATH))

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

export default app