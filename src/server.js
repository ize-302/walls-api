
const express = require('express')
const app = express()
const { PORT } = require('./config');
const routes = require('./routes/index')
const bodyParser = require("body-parser");
const cors = require('cors');
const logger = require('./logger');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// logger info for every request
app.use((req, res, next) => {
  logger.info(`Received a ${req.method} request for ${req.url}`);
  next();
});

app.get('/', (_, res) => res.redirect('/api/v1'))
app.use("/api/v1", routes);
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})