import { Router } from 'express'
import FeedController from "../controllers/feed.controller.js";
import authenticationMiddleware from '../middlewares/authentication.middleware.js';

const feedRoute = Router();

/**
* @swagger
* /feed:
*  get:
*   summary: Get user feed
*   description: Feed contains posts by users that current user is following
*   tags: [Feed]
*   responses:
*    200:
*     description: Successful response
*    401:
*     description: Unauthorised
*    500:
*     description: Internal server error
*   security:
*    - cookieAuth: []
*/
feedRoute.get("/", authenticationMiddleware, FeedController.getFeed);



export default feedRoute