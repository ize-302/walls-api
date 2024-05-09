import { Router } from 'express'
import ProfileController from "../controllers/profile.controller.js";
import authenticationMiddleware from '../middlewares/authentication.middleware.js';

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
*   security:
*    - cookieAuth: []
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
*        displayName:
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
*   security:
*    - cookieAuth: []
*/
profileRoute.put("/update", authenticationMiddleware, ProfileController.update);

export default profileRoute