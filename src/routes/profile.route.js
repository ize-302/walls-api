const { Router } = require('express')
const ProfileController = require("../controllers/profile.controller");
const authenticationMiddleware = require('../middlewares/authentication.middleware');

const profileRoute = Router();

/**
* @swagger
* /profile/me:
*  get:
*   summary: get current profile
*   description: get current profile
*   tags: [Profile]
*   responses:
*    200:
*     description: Successful response
*    500:
*     description: Internal server error
*/
profileRoute.get("/me", authenticationMiddleware, ProfileController.get);

/**
* @swagger
* /profile/update:
*  put:
*   summary: Update current profile
*   description: update current profile
*   tags: [Profile]
*   requestBody:
*    required: true
*    content:
*     application/json:
*      schema:
*       type: object
*       properties:
*        email:
*         type: string
*        name:
*         type: string
*        bio:
*         type: string
*        gender:
*         type: string
*   responses:
*    200:
*     description: Successful response
*    400:
*     description: Could not validate request body
*    409:
*     description: User with email already exists
*    500:
*     description: Internal server error
*/
profileRoute.put("/update", authenticationMiddleware, ProfileController.update);

module.exports = profileRoute