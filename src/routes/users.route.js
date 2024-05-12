import { Router } from 'express'
import UsersController from "../controllers/users.controller.js";
import authenticationMiddleware, { authenticationMiddlewareOptional } from '../middlewares/authentication.middleware.js';

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
usersRoute.get("/:username", authenticationMiddlewareOptional, UsersController.getUserProfile);

/**
* @swagger
* /users/{username}/followers:
*  get:
*   summary: followers by username
*   description: view user followers
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
usersRoute.get("/:username/followers", UsersController.getUserFollowersList)

/**
* @swagger
* /users/{username}/following:
*  get:
*   summary: followings by username
*   description: view user followings
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
usersRoute.get("/:username/following", UsersController.getUserFollowingList)

/**
* @swagger
* /users/follow?username={username}:
*  post:
*   summary: Follow / unfollow a user
*   description: Follow /unfollow a user
*   tags: [Users]
*   parameters:
*    - in: query
*      name: username
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
*     description: User not found /  already unfollowing user
*    409:
*     description: Already following user
*    500:
*     description: Internal server error
*   security:
*    - cookieAuth: []
*/
usersRoute.post("/follow", authenticationMiddleware, UsersController.followUser);

export default usersRoute