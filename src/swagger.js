const swaggerJsdoc = require('swagger-jsdoc');
const { PORT, BASE_PATH } = require('./config');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Walls API doc',
      version: '1.0.0',
    },
    servers: [
      {
        url: `http://localhost:${PORT}${BASE_PATH}`,
        description: "Development"
      }
    ]
  },
  apis: ['src/routes/auth.route.js', 'src/routes/profile.route.js', 'src/routes/settings.route.js'],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs

