import {
  StatusCodes,
} from 'http-status-codes';
import yup from 'yup'

import { db } from "../db/index.js";
import { comments, follows, posts, profiles, users } from '../db/schema.js';
import { eq, inArray } from 'drizzle-orm';
import { handleErrors, fetchComments, fetchPosts } from './helpers.js';


class FeedController {
  static async getFeed(req, res) {
    try {
      const { user: user_session_data } = req.session
      // get followings
      const followings = await db.select({
        id: users.id,
        username: users.username,
        displayName: profiles.displayName,
        avatar_url: profiles.avatar_url
      }).from(follows).where(eq(follows.followed_by, user_session_data.id))
        .leftJoin(profiles, eq(profiles.userid, follows.user_id))
        .leftJoin(users, eq(users.id, follows.user_id))
      const followings_ids = followings.map(item => item.id)

      // get every post / comments made by followings
      const followingPosts = await db
        .select()
        .from(posts)
        .where(inArray(posts.author_id, followings_ids));
      let posts_ids = followingPosts.map(a => a.id);
      const postsData = await fetchPosts(posts_ids, user_session_data ? user_session_data.id : null)

      const followingComments = await db
        .select()
        .from(comments)
        .where(inArray(comments.author_id, followings_ids));
      let comments_ids = followingComments.map(a => a.id);
      const commentsData = await fetchComments(comments_ids, user_session_data ? user_session_data.id : null)

      const sortedResponse = [...commentsData, ...postsData].sort((a, b) => new Date(b.created) - new Date(a.created));

      return res.status(StatusCodes.OK).json({ success: true, data: { items: sortedResponse } })
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

}

export default FeedController