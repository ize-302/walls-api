import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';
import yup from 'yup'

import { db } from "../db/index.js";
import { comments, likes, posts, profiles, users } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';
import { fetchPostDetail, handleErrors, fetchLikesAuthors, fetchComments } from './helpers.js';

const createPostSchema = yup.object({
  message: yup.string().max(180, 'Message cannot be more than 180 characters').required(), // when changing this, dont forgrt to update column on db schema 
})

class PostsController {
  static async createPost(req, res) {
    try {
      await createPostSchema.validate(req.body)
      const { user: user_session_data } = req.session
      const { message, parent_id } = req.body

      if (parent_id) {
        const [comment] = await db
          .insert(comments)
          .values({ author_id: user_session_data.id, message, parent_id }).returning()
        res
          .status(StatusCodes.CREATED)
          .json({ success: true, data: comment });
      } else {
        const [post] = await db
          .insert(posts)
          .values({ author_id: user_session_data.id, message, }).returning()
        res
          .status(StatusCodes.CREATED)
          .json({ success: true, data: post });
      }
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async getPost(req, res) {
    try {
      const { id } = req.params
      const { user: user_session_data } = req.session

      const post = await fetchPostDetail(id, user_session_data ? user_session_data.id : null)
      if (post === undefined) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Post ' + ReasonPhrases.NOT_FOUND });

      res
        .status(StatusCodes.OK)
        .json({ success: true, data: { ...post } });
    } catch (error) {
      handleErrors(res, error, null)
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
      handleErrors(res, error, null)
    }
  }

  static async getCommentsByPost(req, res) {
    try {
      const { id } = req.params
      const { user: user_session_data } = req.session
      const [post] = await db.select({
        id: posts.id,
      }).from(posts).where(eq(posts.id, id))

      if (post) {
        const postComments = await db.select({ id: comments.id }).from(comments).where(eq(comments.parent_id, id))
        let comments_ids = postComments.map(item => item.id);
        const postCommentsData = await fetchComments(comments_ids, user_session_data ? user_session_data.id : null)
        res.status(StatusCodes.OK).json({ success: true, data: { items: postCommentsData } })
      }
      else {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User ' + ReasonPhrases.NOT_FOUND });
      }
    } catch (error) {
      handleErrors(res, error, null)
    }
  }
}

export default PostsController