const { Router } = require('express')
const SettingsController = require("../controllers/settings.controller");
const authorizationMiddleware = require('../middlewares/authorization.middleware');

const settingsRoute = Router();

/**
* @swagger
* /settings/change-username:
*  put:
*   summary: Update current user's username
*   description: update username
*   tags: [Settings]
*   requestBody:
*    required: true
*    content:
*     application/json:
*      schema:
*       type: object
*       properties:
*        username:
*         type: string
*   responses:
*    200:
*     description: Successful response
*    400:
*     description: Could not validate request body
*    409:
*     description: Username already in use
*    500:
*     description: Internal server error
*/
settingsRoute.put("/change-username", authorizationMiddleware, SettingsController.changeUsername);

module.exports = settingsRoute