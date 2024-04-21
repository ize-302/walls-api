
const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const swaggerUi = require('swagger-ui-express');
const cors = require('cors')

const { PORT, BASE_PATH } = require('./config');
const routes = require('./routes/index')
const loggerMiddleware = require('./middlewares/logger.middleware');
const swaggerDocs = require('./swagger');
const sessionMiddleware = require("./middlewares/session.middleware");

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

app.use(BASE_PATH, routes);
app.use(`${BASE_PATH}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (_, res) => res.redirect(BASE_PATH))

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

module.exports = app