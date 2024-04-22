const { Router } = require('express')
const SettingsController = require("../controllers/settings.controller");
const authenticationMiddleware = require('../middlewares/authentication.middleware');

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
settingsRoute.put("/change-username", authenticationMiddleware, SettingsController.changeUsername);

/**
* @swagger
* /settings/change-password:
*  post:
*   summary: Update current user's password
*   description: update password
*   tags: [Settings]
*   requestBody:
*    required: true
*    content:
*     application/json:
*      schema:
*       type: object
*       properties:
*        currentPassword:
*         type: string
*        newPassword:
*         type: string
*   responses:
*    200:
*     description: Successful response
*    400:
*     description: Could not validate request body
*    401:
*     description: Unauthorised
*    500:
*     description: Internal server error
*/
settingsRoute.post("/change-password", authenticationMiddleware, SettingsController.changePassword);

module.exports = settingsRoute