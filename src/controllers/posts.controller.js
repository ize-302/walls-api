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
      const { message } = req.body
      const [post] = await db
        .insert(posts)
        .values({ author_id: user_session_data.id, message, }).returning()
      res
        .status(StatusCodes.CREATED)
        .json({ success: true, data: post });
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

  static async likePost(req, res) {
    try {
      const { id } = req.params
      const { user: user_session_data } = req.session

      const [post] = await db.select({
        id: posts.id,
        author_id: posts.author_id
      }).from(posts).where(eq(posts.id, id))

      if (post === undefined) {
        res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Post ' + ReasonPhrases.NOT_FOUND });
      } else {
        const likesCountResult = await db.select({ author_id: likes.author_id }).from(likes).where(eq(likes.parent_id, id))
        let currentUserLiked = false
        if (user_session_data) {
          currentUserLiked = likesCountResult.find(item => item.author_id === user_session_data.id) ? true : false
        }
        if (currentUserLiked) {
          // unlike
          const [post] = await db.delete(likes).where(and(eq(likes.parent_id, id), eq(likes.parent_id, user_session_data.id))).returning()
          return res.status(StatusCodes.OK).json({ success: true, data: { currentUserLiked: false, post } })
        } else {
          // like
          const [post] = await db
            .insert(likes)
            .values({ author_id: user_session_data.id, parent_id: id, }).returning()
          return res.status(StatusCodes.OK).json({ success: true, data: { currentUserLiked: true, post } })
        }
      }
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

  static async getLikesByPost(req, res) {
    try {
      const { id } = req.params
      const { user: user_session_data } = req.session
      const [post] = await db.select({
        id: posts.id,
      }).from(posts).where(eq(posts.id, id))

      if (post) {
        const postLikes = await db.select({ author_id: likes.author_id }).from(likes).where(eq(likes.parent_id, id))
        let likes_ids = postLikes.map(item => item.author_id);
        const postLikesData = await fetchLikesAuthors(likes_ids, user_session_data ? user_session_data.id : null)
        res.status(StatusCodes.OK).json({ success: true, data: { items: postLikesData } })
      }
      else {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User ' + ReasonPhrases.NOT_FOUND });
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