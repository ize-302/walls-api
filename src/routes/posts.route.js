import { Router } from 'express'
import PostsController from "../controllers/posts.controller.js";
import authenticationMiddleware, { authenticationMiddlewareOptional } from '../middlewares/authentication.middleware.js';

const postsRoute = Router();

/**
* @swagger
* /posts:
*  post:
*   summary: Create a new post / reply a post
*   description: create new post / reply a post
*   tags: [Posts]
*   requestBody:
*    required: true
*    content:
*     application/json:
*      schema:
*       type: object
*       properties:
*        message:
*         type: string
*        parent_id:
*         type: string
*   responses:
*    201:
*     description: Successful response. Post created
*    400:
*     description: Could not validate request body
*    401:
*     description: Unauthorised
*    500:
*     description: Internal server error
*   security:
*    - cookieAuth: []
*/
postsRoute.post("/", authenticationMiddleware, PostsController.createPost);

/**
* @swagger
* /posts/{id}:
*  get:
*   summary: Read a post / comment
*   description: read a post / comment
*   tags: [Posts]
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
*     description: Post not found
*    500:
*     description: Internal server error
*/
postsRoute.get("/:id", authenticationMiddlewareOptional, PostsController.getPost);

/**
* @swagger
* /posts/{id}:
*  delete:
*   summary: delete a post / comment
*   description: delete a post / comment
*   tags: [Posts]
*   parameters:
*    - in: path
*      name: id
*      schema:
*       type: string
*      required: true
*   responses:
*    200:
*     description: Successful response
*    401:
*     description: Unauthorised
*    403:
*     description: Forbidden from deleting a post you arent the author of
*    404:
*     description: not found
*    500:
*     description: Internal server error
*   security:
*    - cookieAuth: []
*/
postsRoute.delete("/:id", authenticationMiddleware, PostsController.deletePost);

/**
* @swagger
* /posts/{id}/replies:
*  get:
*   summary: Fetches list of replies to a post
*   description: Fetches list of replies to a post
*   tags: [Posts]
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
*     description: Post not found
*    500:
*     description: Internal server error
*/
postsRoute.get("/:id/replies", authenticationMiddlewareOptional, PostsController.getCommentsByPost);

export default postsRoute