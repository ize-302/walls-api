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
        url: `http://localhost:${PORT}/${BASE_PATH}`,
        description: "Development"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          name: 'Authorization',
          scheme: 'bearer',
          in: 'header',
        },
      },
    }
  },
  apis: ['src/routes/auth.route.js'],
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs

