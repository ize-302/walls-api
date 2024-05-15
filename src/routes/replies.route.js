import { Router } from 'express'
import RepliesController from "../controllers/replies.controller.js";
import authenticationMiddleware, { authenticationMiddlewareOptional } from '../middlewares/authentication.middleware.js';

const repliesRoute = Router();

/**
* @swagger
* /replies:
*  post:
*   summary: Create a new reply
*   description: create new post
*   tags: [Replies]
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
*     description: Successful response. reply created
*    400:
*     description: Could not validate request body
*    401:
*     description: Unauthorised
*    500:
*     description: Internal server error
*   security:
*    - cookieAuth: []
*/
repliesRoute.post("/", authenticationMiddleware, RepliesController.newReply);

/**
* @swagger
* /replies/{id}:
*  get:
*   summary: Read a reply
*   description: read a reply
*   tags: [Replies]
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
repliesRoute.get("/:id", authenticationMiddlewareOptional, RepliesController.getReply);

/**
* @swagger
* /replies/{id}:
*  delete:
*   summary: delete a reply
*   description: delete a reply
*   tags: [Replies]
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
*     description: Forbidden from deleting a reply you arent the author of
*    404:
*     description: reply not found
*    500:
*     description: Internal server error
*   security:
*    - cookieAuth: []
*/
repliesRoute.delete("/:id", authenticationMiddleware, RepliesController.deleteReply);

/**
* @swagger
* /replies/{id}/replies:
*  get:
*   summary: Fetches list of replies on a reply
*   description: Fetches list of replies on a reply
*   tags: [Replies]
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
repliesRoute.get("/:id/replies", authenticationMiddlewareOptional, RepliesController.getComments);

export default repliesRoute