import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';
import yup from 'yup'

import { db } from "../db/index.js";
import { posts, profiles, users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const createPostSchema = yup.object({
  message: yup.string().max(180, 'Message cannot be more than 180 characters').required(), // when changing this, dont forgrt to update column on db schema 
})

class PostsController {
  static async createPost(req, res) {
    try {
      await createPostSchema.validate(req.body)
      const { user: user_session_data } = req.session
      const { message } = req.body
      await db
        .insert(posts)
        .values({ author_id: user_session_data.id, message, }).returning()
      res
        .status(StatusCodes.CREATED)
        .json({ success: true, message: 'Post has been created' });
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    }
  }

  static async getPost(req, res) {
    try {
      const { id } = req.params

      // get post detail
      const [post] = await db.select({
        id: posts.id,
        message: posts.message,
        created: posts.created,
        author_id: posts.author_id,
        author_username: users.username,
        author_displayName: profiles.displayName,
        author_avatar_url: profiles.avatar_url
      }).from(posts).where(eq(posts.id, id))
        .leftJoin(profiles, eq(profiles.userid, posts.author_id))
        .leftJoin(users, eq(users.id, posts.author_id))

      if (post === undefined) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Post ' + ReasonPhrases.NOT_FOUND });
      res
        .status(StatusCodes.OK)
        .json({ success: true, data: post });
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    }
  }

  static async deletePost(req, res) {
    try {
      const { id } = req.params
      const { user: user_session_data } = req.session

      const [post] = await db.select({
        id: posts.id,
        author_id: posts.author_id
      }).from(posts).where(eq(posts.id, id))
      if (post === undefined) {
        res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Post ' + ReasonPhrases.NOT_FOUND });
      } else if (user_session_data.id !== post.author_id) {
        res.status(StatusCodes.FORBIDDEN).json({ success: false, message: ReasonPhrases.FORBIDDEN });
      }
      else {
        await db.delete(posts).where(eq(posts.id, id))
        res
          .status(StatusCodes.OK)
          .json({ success: true, message: 'Post has been deleted' });
      }
    } catch (error) {
      console.log(error)
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    }
  }
}

export default PostsController