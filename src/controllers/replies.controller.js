import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';
import yup from 'yup'

import { db } from "../db/index.js";
import { fetchCommentDetail, handleErrors } from "./helpers.js";
import { posts, comments } from "../db/schema.js";
import { eq } from 'drizzle-orm';

const repliesSchema = yup.object({
  message: yup.string().required('Message is required'),
  parent_id: yup.string().required('Parent Post id'),
})


class RepliesController {
  static async newReply(req, res) {
    try {
      await repliesSchema.validate(req.body)
      const { user: user_session_data } = req.session
      const { message, parent_id } = req.body
      const [post] = await db.select().from(posts).where(eq(posts.id, parent_id))
      if (post === undefined) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Post ' + ReasonPhrases.NOT_FOUND });
      const [reply] = await db
        .insert(comments)
        .values({ author_id: user_session_data.id, message, parent_id }).returning()
      res
        .status(StatusCodes.CREATED)
        .json({ success: true, data: reply });
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async getReply(req, res) {
    try {
      const { id } = req.params
      const { user: user_session_data } = req.session
      const reply = await fetchCommentDetail(id, user_session_data ? user_session_data.id : null)
      if (reply !== undefined) {
        res
          .status(StatusCodes.OK)
          .json({ success: true, data: { ...reply } });
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Reply ' + ReasonPhrases.NOT_FOUND });
      }
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async deleteReply(req, res) {
    try {
      console.log('first')
      const { id } = req.params
      const { user: user_session_data } = req.session
      const [reply] = await db.select({
        id: comments.id,
        author_id: comments.author_id
      }).from(comments).where(eq(comments.id, id))
      if (reply === undefined) {
        res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'Reply ' + ReasonPhrases.NOT_FOUND });
      } else if (user_session_data.id !== reply.author_id) {
        res.status(StatusCodes.FORBIDDEN).json({ success: false, message: ReasonPhrases.FORBIDDEN });
      }
      else {
        await db.delete(comments).where(eq(comments.id, id))
        res
          .status(StatusCodes.OK)
          .json({ success: true, message: 'Reply has been deleted' });
      }
    } catch (error) {
      console.log(error)
      handleErrors(res, error, null)
    }
  }

  static async getComments(req, res) {
    try {
      const { id } = req.params

      res
        .status(StatusCodes.OK)
        .json({ success: true, data: {} });
    } catch (error) {
      handleErrors(res, error, null)
    }
  }
}

export default RepliesController