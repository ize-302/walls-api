const { Router } = require('express')
const AuthController = require("../controllers/auth.controller");

const authRoute = Router();

/**
* @swagger
* /register:
*  post:
*   summary: Create a new user
*   description: create new user
*   tags: [Authentication]
*   requestBody:
*    required: true
*    content:
*     application/json:
*      schema:
*       type: object
*       properties:
*        username:
*         type: string
*        password:
*         type: string
*   responses:
*    201:
*     description: Successful response
*    400:
*     description: Could not validate request body
*    409:
*     description: User with username already exists
*    500:
*     description: Internal server error
*/
authRoute.post("/register", AuthController.register);

/**
* @swagger
* /login:
*  post:
*   summary: Log in user
*   description: Gives user access to the web app
*   tags: [Authentication]
*   requestBody:
*    required: true
*    content:
*     application/json:
*      schema:
*       type: object
*       properties:
*        username:
*         type: string
*        password:
*         type: string
*   responses:
*    200:
*     description: Successful responsepos
*    401:
*     description: Incorrect username / password
*    500:
*     description: Internal server error
*/
authRoute.post("/login", AuthController.login);

/**
* @swagger
* /logout:
*  post:
*   summary: Log out user
*   description: Deny user access to the web app
*   tags: [Authentication]
*   responses:
*    200:
*     description: Successful responsepos
*    500:
*     description: Internal server error
*/
authRoute.post("/logout", AuthController.logout);

module.exports = authRoute