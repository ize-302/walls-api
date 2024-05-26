import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';
import yup from 'yup'

import { db } from "../db/index.js";
import { comments, likes, posts, profiles, users } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';
import { fetchPostDetail, handleErrors, fetchLikesAuthors, fetchComments, fetchCommentDetail } from './helpers.js';


class LikesController {
  static async likeEntity(req, res) {
    try {
      const { postId, type } = req.body
      const { user: user_session_data } = req.session
      const schema_in_use = type === 'POST' ? posts : type === 'REPLY' ? comments : null
      // validate type
      if (schema_in_use == null) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Unknown type' });
      // check if entity exists i.e post / reply in db depending on type
      const [entity] = await db.select({
        id: schema_in_use.id,
        author_id: schema_in_use.author_id
      }).from(schema_in_use).where(eq(schema_in_use.id, postId))
      if (entity === undefined) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Entity ' + ReasonPhrases.NOT_FOUND });
      // check if entity has already being liked by current user
      const [like] = await db.select().from(likes).where(and(eq(likes.parent_id, postId), eq(likes.author_id, user_session_data.id)))
      if (like) return res.status(StatusCodes.CONFLICT).json({ success: false, message: 'You already liked this post' })
      // go ahead and add new like to db
      await db
        .insert(likes)
        .values({ author_id: user_session_data.id, parent_id: postId, }).returning()

      let postData = {}
      if (type === 'POST') {
        postData = await fetchPostDetail(entity.id, user_session_data.id)
      } else {
        postData = await fetchCommentDetail(entity.id, user_session_data.id)
      }
      return res.status(StatusCodes.CREATED).json({ success: true, data: { ...postData } })
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async unlikeEntity(req, res) {
    try {
      const { post_id } = req.params
      const { user: user_session_data } = req.session
      // check if entity has already being liked by current user
      const [like] = await db.select().from(likes).where(and(eq(likes.parent_id, post_id), eq(likes.author_id, user_session_data.id)))
      if (like === undefined) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Cannot perform action' })
      const [delete_entity] = await db.delete(likes).where(and(eq(likes.parent_id, post_id), eq(likes.author_id, user_session_data.id))).returning()
      let postData = {}
      if (like.parent_id) {
        postData = await fetchCommentDetail(post_id, user_session_data.id)
      } else {
        postData = await fetchPostDetail(post_id, user_session_data.id)
      }
      if (delete_entity) return res.status(StatusCodes.OK).json({ data: { ...postData } })
      else return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Entity ' + ReasonPhrases.NOT_FOUND });
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async getLikesAuthors(req, res) {
    try {
      const { post_id } = req.params
      const { user: user_session_data } = req.session

      const postLikes = await db.select({ author_id: likes.author_id }).from(likes).where(eq(likes.parent_id, post_id))
      let likes_ids = postLikes.map(item => item.author_id);
      const postLikesData = await fetchLikesAuthors(likes_ids, user_session_data ? user_session_data.id : null)
      res.status(StatusCodes.OK).json({ success: true, data: { items: postLikesData } })

    } catch (error) {
      handleErrors(res, error, null)
    }
  }
}

export default LikesController