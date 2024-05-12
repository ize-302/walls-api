import { eq, and } from "drizzle-orm";
import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';

import { db } from "../db/index.js";
import { users, profiles, follows } from "../db/schema.js";
import { fetchUserDetail, isUserExists } from "./helpers.js";

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
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
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
      }).from(follows).where(eq(follows.follower_id, user.id))
        .leftJoin(profiles, eq(profiles.userid, follows.followed_id))
        .leftJoin(users, eq(users.id, follows.followed_id))
      res
        .status(StatusCodes.OK)
        .json({
          success: true, data: { items: followings }
        });
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
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
      }).from(follows).where(eq(follows.followed_id, user.id))
        .leftJoin(profiles, eq(profiles.userid, follows.follower_id))
        .leftJoin(users, eq(users.id, follows.follower_id))

      res
        .status(StatusCodes.OK)
        .json({
          success: true, data: { items: followers }
        });
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
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
          eq(follows.follower_id, user_session_data.id),
          eq(follows.followed_id, user.id)
        )
      )
      if (isFollowing.length > 0) return res.status(StatusCodes.CONFLICT).json({ success: false, message: `You are already following user (${username})` });

      await db
        .insert(follows)
        .values({ followed_id: user.id, follower_id: user_session_data.id }).returning()
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: `You are now following user (${username})` });
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
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
          eq(follows.follower_id, user_session_data.id),
          eq(follows.followed_id, user.id)
        )
      )
      if (isFollowing.length > 0) {
        await db.delete(follows).where(
          and(
            eq(follows.follower_id, user_session_data.id),
            eq(follows.followed_id, user.id)
          )
        )
        return res
          .status(StatusCodes.OK)
          .json({ success: true, message: `You have now unfollowed user (${username})` });
      }
      res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'You are not originally following user' });
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
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
        if (user.currentUserFollowing) {
          // you have unfollowed user
          await db.delete(follows).where(
            and(
              eq(follows.follower_id, user_session_data.id),
              eq(follows.followed_id, user.id)
            )
          )
          res
            .status(StatusCodes.OK)
            .json({ success: true, message: `You have now unfollowed user (${username})` });
        } else {
          // follow user
          await db
            .insert(follows)
            .values({ followed_id: user.id, follower_id: user_session_data.id }).returning()
          res
            .status(StatusCodes.OK)
            .json({ success: true, message: `You are now following user (${username})` });
        }
      } else {
        res.status(StatusCodes.NOT_FOUND).json({ success: false, message: 'User ' + ReasonPhrases.NOT_FOUND });
      }

    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }

    }
  }
}

export default UsersController