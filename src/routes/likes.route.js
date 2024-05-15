import { Router } from 'express'
import LikesController from "../controllers/likes.controller.js";
import authenticationMiddleware, { authenticationMiddlewareOptional } from '../middlewares/authentication.middleware.js';

const likesRoute = Router();

/**
* @swagger
* /likes:
*  post:
*   summary: Like an entity i.e post or reply
*   description: Like an entity i.e post or reply
*   tags: [Likes]
*   requestBody:
*    required: true
*    content:
*     application/json:
*      schema:
*       type: object
*       properties:
*        type:
*         type: string
*        postId:
*         type: string
*   responses:
*    201:
*     description: Successful response. Liked
*    400:
*     description: Could not validate request body
*    401:
*     description: Unauthorised
*    500:
*     description: Internal server error
*   security:
*    - cookieAuth: []
*/
likesRoute.post("/", authenticationMiddleware, LikesController.likeEntity);

/**
* @swagger
* /likes/{post_id}:
*  delete:
*   summary: Unlike an entity i.e post or reply
*   description: Unlike an entity i.e post or reply
*   tags: [Likes]
*   parameters:
*    - in: path
*      name: post_id
*      schema:
*       type: string
*      required: true
*   responses:
*    201:
*     description: Successful response. Unliked
*    401:
*     description: Unauthorised
*    500:
*     description: Internal server error
*   security:
*    - cookieAuth: []
*/
likesRoute.delete("/:post_id", authenticationMiddleware, LikesController.unlikeEntity);

/**
* @swagger
* /likes/{post_id}:
*  get:
*   summary: Fetches list of users who have liked an entity i.e post or reply
*   description: Fetches list of users who have liked an entity i.e post or reply
*   tags: [Likes]
*   parameters:
*    - in: path
*      name: post_id
*      schema:
*       type: string
*      required: true
*   responses:
*    200:
*     description: Successful response
*    404:
*     description: Post not found
*    500:
*     description: Internal server error
*/
likesRoute.get("/:post_id", authenticationMiddlewareOptional, LikesController.getLikesAuthors);

export default likesRoute