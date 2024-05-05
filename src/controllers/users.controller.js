import { eq, and } from "drizzle-orm";
import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';

import { db } from "../db/index.js";
import { users, profiles, follows } from "../db/schema.js";

class UsersController {
  static async getUserProfile(req, res) {
    try {
      const { username } = req.params
      const result = await db.select({
        id: users.id,
        username: users.username,
        email: profiles.email,
        displayName: profiles.displayName,
        bio: profiles.bio,
        gender: profiles.gender,
        avatar_url: profiles.avatar_url
      }).from(users).where(eq(users.username, username))
        .leftJoin(profiles, eq(users.id, profiles.userid))

      if (result.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: ReasonPhrases.NOT_FOUND });
      }
      res
        .status(StatusCodes.OK)
        .json({ success: true, data: result[0] });


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
      const { target } = req.query // target represents username
      // does target exist in user?
      const result = await db.select().from(users).where(eq(users.username, target))
      if (result.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: ReasonPhrases.NOT_FOUND });
      }
      // check if already following user
      const isFollowing = await db.select().from(follows).where(
        and(
          eq(follows.follower_id, user_session_data.id),
          eq(follows.followed_id, result[0].id)
        )
      )

      if (isFollowing.length > 0) {
        return res.status(StatusCodes.CONFLICT).json({ success: false, message: `You are already following user (${target})` });
      }

      await db
        .insert(follows)
        .values({ followed_id: result[0].id, follower_id: user_session_data.id })
      res
        .status(StatusCodes.OK)
        .json({ success: true, message: `You are now following user (${target})` });
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
      const { target } = req.query
      // does target exist in user?
      const result = await db.select().from(users).where(eq(users.username, target))
      if (result.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: ReasonPhrases.NOT_FOUND });
      }
      // check if following user
      const isFollowing = await db.select().from(follows).where(
        and(
          eq(follows.follower_id, user_session_data.id),
          eq(follows.followed_id, result[0].id)
        )
      )
      if (isFollowing.length > 0) {
        await db.delete(follows).where(
          and(
            eq(follows.follower_id, user_session_data.id),
            eq(follows.followed_id, result[0].id)
          )
        )
        return res
          .status(StatusCodes.OK)
          .json({ success: true, message: `You have now unfollowed user (${target})` });
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
}

export default UsersController