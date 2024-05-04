import { Router } from 'express'
import UsersController from "../controllers/users.controller.js";
import authenticationMiddleware from '../middlewares/authentication.middleware.js';

const usersRoute = Router();

/**
* @swagger
* /users/{id}:
*  get:
*   summary: user profile by id
*   description: view user profile
*   tags: [Users]
*   parameters:
*    - in: path
*      name: id
*      schema:
*       type: string
*      required: true
*   responses:
*    200:
*     description: Successful response
*    404:
*     description: User not found
*    500:
*     description: Internal server error
*/
usersRoute.get("/:id", UsersController.getUserProfile);

/**
* @swagger
* /users/follow:
*  post:
*   summary: Log in user
*   description: Gives user access to the web app
*   tags: [Users]
*   parameters:
*    - in: query
*      name: target
*      schema:
*       type: string
*      required: true
*   responses:
*    200:
*     description: Successful responsepos
*    401:
*     description: Unauthorised
*    404:
*     description: User not found
*    409:
*     description: Already following user
*    500:
*     description: Internal server error
*   security:
*    - cookieAuth: []
*/
usersRoute.post("/follow", authenticationMiddleware, UsersController.followUser);

/**
* @swagger
* /users/unfollow:
*  post:
*   summary: Unfollow user
*   description: Unfollow a user
*   tags: [Users]
*   parameters:
*    - in: query
*      name: target
*      schema:
*       type: string
*      required: true
*   responses:
*    200:
*     description: Successful responsepos
*    401:
*     description: Unauthorised
*    404:
*     description: user not found / already unfollowing user
*    500:
*     description: Internal server error
*   security:
*    - cookieAuth: []
*/
usersRoute.post("/unfollow", authenticationMiddleware, UsersController.unfollowUser);

export default usersRoute