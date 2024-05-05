import { Router } from 'express'
import UsersController from "../controllers/users.controller.js";
import authenticationMiddleware from '../middlewares/authentication.middleware.js';

const usersRoute = Router();

/**
* @swagger
* /users/{username}:
*  get:
*   summary: user profile by username
*   description: view user profile
*   tags: [Users]
*   parameters:
*    - in: path
*      name: username
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
usersRoute.get("/:username", UsersController.getUserProfile);

/**
* @swagger
* /users/follow:
*  post:
*   summary: Follow a user
*   description: Follow a user
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
*    400:
*     description: Cant follow yourself
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