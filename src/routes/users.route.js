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
*   summary: Follow a user
*   description: Follow a user
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

/**
* @swagger
* /users/unfollow?username={username}:
*  delete:
*   summary: unfollow a user
*   description: unfollow a user
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
*     description: You are not following this user
*    409:
*     description: Already following user
*    500:
*     description: Internal server error
*   security:
*    - cookieAuth: []
*/
usersRoute.delete("/unfollow", authenticationMiddleware, UsersController.unfollowUser);

/**
* @swagger
* /users/{username}/posts:
*  get:
*   summary: get a user's posts
*   description: Get user's posts
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
usersRoute.get("/:username/posts", UsersController.getUserCreatedPosts)

/**
* @swagger
* /users/{username}/liked:
*  get:
*   summary: get a user's liked posts
*   description: Get user's liked posts
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
usersRoute.get("/:username/liked", UsersController.getUserLikedPosts)


/**
* @swagger
* /users/{username}/replies:
*  get:
*   summary: get a user's replies 
*   description: Get user's replies 
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
usersRoute.get("/:username/replies", UsersController.getUserReplies)

export default usersRoute