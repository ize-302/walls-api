import { eq, and } from "drizzle-orm";
import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';

import { db } from "../db/index.js";
import { users, profiles, follows, posts, likes, comments } from "../db/schema.js";
import { fetchPosts, fetchUserDetail, handleErrors, isUserExists } from "./helpers.js";

class UsersController {
  static async getUserProfile(req, res) {
    try {
      const { username } = req.params
      const user = await fetchUserDetail(req, res, username)
      if (user) {
        res
          .status(StatusCodes.OK)
          .json({
            success: true, data: user
          });
      } else {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User ' + ReasonPhrases.NOT_FOUND });
      }
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async getUserFollowingList(req, res) {
    try {
      const user = await isUserExists(req.params.username)
      if (user === undefined) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: ReasonPhrases.NOT_FOUND });
      const followings = await db.select({
        id: users.id,
        username: users.username,
        email: profiles.email,
        displayName: profiles.displayName,
        bio: profiles.bio,
        gender: profiles.gender,
        avatar_url: profiles.avatar_url
      }).from(follows).where(eq(follows.followed_by, user.id))
        .leftJoin(profiles, eq(profiles.userid, follows.user_id))
        .leftJoin(users, eq(users.id, follows.user_id))
      res
        .status(StatusCodes.OK)
        .json({
          success: true, data: { items: followings }
        });
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async getUserFollowersList(req, res) {
    try {
      const user = await isUserExists(req.params.username)
      if (user === undefined) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: ReasonPhrases.NOT_FOUND });

      const followers = await db.select({
        id: users.id,
        username: users.username,
        email: profiles.email,
        displayName: profiles.displayName,
        bio: profiles.bio,
        gender: profiles.gender,
        avatar_url: profiles.avatar_url
      }).from(follows).where(eq(follows.user_id, user.id))
        .leftJoin(profiles, eq(profiles.userid, follows.followed_by))
        .leftJoin(users, eq(users.id, follows.followed_by))

      res
        .status(StatusCodes.OK)
        .json({
          success: true, data: { items: followers }
        });
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async followUser(req, res) {
    try {
      const { user: user_session_data } = req.session
      const { username } = req.query
      const user = await isUserExists(username)
      if (user === undefined) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: ReasonPhrases.NOT_FOUND });

      // Ensure user cant follow self
      if (user.id === user_session_data.id) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Cannot follow yourself' });

      // Check to see if target user is already being followed
      const isFollowing = await db.select().from(follows).where(
        and(
          eq(follows.followed_by, user_session_data.id),
          eq(follows.user_id, user.id)
        )
      )
      if (isFollowing.length > 0) return res.status(StatusCodes.CONFLICT).json({ success: false, message: `You are already following user (${username})` });

      await db
        .insert(follows)
        .values({ user_id: user.id, followed_by: user_session_data.id }).returning()
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: `You are now following user (${username})` });
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async unfollowUser(req, res) {
    try {
      const { user: user_session_data } = req.session
      const { username } = req.query
      const user = await isUserExists(username)
      if (user === undefined) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: ReasonPhrases.NOT_FOUND });

      // check if following user
      const isFollowing = await db.select().from(follows).where(
        and(
          eq(follows.followed_by, user_session_data.id),
          eq(follows.user_id, user.id)
        )
      )
      if (isFollowing.length > 0) {
        await db.delete(follows).where(
          and(
            eq(follows.followed_by, user_session_data.id),
            eq(follows.user_id, user.id)
          )
        )
        return res
          .status(StatusCodes.OK)
          .json({ success: true, message: `You have now unfollowed user (${username})` });
      }
      res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'You are not originally following user' });
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async followUser(req, res) {
    try {
      const { user: user_session_data } = req.session
      const { username } = req.query
      const user = await fetchUserDetail(req, res, username)

      if (user) {
        // Ensure user cant follow self
        if (user.id === user_session_data.id) return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Cannot follow / unfollow yourself' });

        // is following user
        if (user.currentUserIsFollower) {
          // you have unfollowed user
          await db.delete(follows).where(
            and(
              eq(follows.followed_by, user_session_data.id),
              eq(follows.user_id, user.id)
            )
          )
          res
            .status(StatusCodes.OK)
            .json({ success: true, message: `You have now unfollowed user (${username})` });
        } else {
          // follow user
          await db
            .insert(follows)
            .values({ user_id: user.id, followed_by: user_session_data.id }).returning()
          res
            .status(StatusCodes.OK)
            .json({ success: true, message: `You are now following user (${username})` });
        }
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User ' + ReasonPhrases.NOT_FOUND });
      }
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async getUserCreatedPosts(req, res) {
    try {
      const { username } = req.params
      const { user: user_session_data } = req.session
      const user = await fetchUserDetail(req, res, username)
      if (user) {
        const userPosts = await db.select({ id: posts.id }).from(posts).where(eq(posts.author_id, user.id))
        let posts_ids = userPosts.map(a => a.id);
        const postsData = await fetchPosts(posts_ids, user_session_data ? user_session_data.id : null)
        res.status(StatusCodes.OK).json({ success: true, data: { items: postsData } })
      }
      else {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User ' + ReasonPhrases.NOT_FOUND });
      }
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async getUserLikedPosts(req, res) {
    try {
      const { username } = req.params
      const { user: user_session_data } = req.session
      const user = await fetchUserDetail(req, res, username)
      if (user) {
        const userLikedPosts = await db.select({ id: likes.id }).from(likes).where(eq(likes.author_id, user.id))
        let liked_posts_ids = userLikedPosts.map(a => a.id);
        const likedPostsData = await fetchPosts(liked_posts_ids, user_session_data ? user_session_data.id : null)
        res.status(StatusCodes.OK).json({ success: true, data: { items: likedPostsData } })
      }
      else {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User ' + ReasonPhrases.NOT_FOUND });
      }
    } catch (error) {
      handleErrors(res, error, null)
    }
  }

  static async getUserReplies(req, res) {
    try {
      const { username } = req.params
      const { user: user_session_data } = req.session
      const user = await fetchUserDetail(req, res, username)
      if (user) {
        const userComments = await db.select({ id: comments.id }).from(comments).where(eq(comments.author_id, user.id))
        let comments_ids = userComments.map(a => a.id);
        const commentsData = await fetchPosts(comments_ids, user_session_data ? user_session_data.id : null)
        res.status(StatusCodes.OK).json({ success: true, data: { items: commentsData } })
      }
      else {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User ' + ReasonPhrases.NOT_FOUND });
      }
    } catch (error) {
      handleErrors(res, error, null)
    }
  }
}

export default UsersController