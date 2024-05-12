import { eq } from "drizzle-orm"
import { follows, profiles, users } from "../db/schema.js"
import { db } from "../db/index.js"
import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';
import bcrypt from "bcrypt";

/**
 * Find user by username
 *
 * @async
 * @param {*} username
 * @returns user object if user found or send a 404 status code
 */
export const fetchUserDetail = async (req, res, username) => {
  const { user: user_session_data } = req.session

  const [userDetail] = await db.select({
    id: users.id,
    username: users.username,
    email: profiles.email,
    displayName: profiles.displayName,
    bio: profiles.bio,
    gender: profiles.gender,
    avatar_url: profiles.avatar_url
  }).from(users).where(eq(users.username, username)).leftJoin(profiles, eq(users.id, profiles.userid))
  if (userDetail === undefined) {
    return null
  } else {
    const followings = await db.select().from(follows).where(eq(follows.followed_by, userDetail.id))
    const followers = await db.select().from(follows).where(eq(follows.user_id, userDetail.id))
    let currentUserIsFollower = false
    if (user_session_data) {
      currentUserIsFollower = followers.find(item => item.followed_by === user_session_data.id) ? true : false
    }
    let isFollowingCurrentUser = false
    if (user_session_data) {
      isFollowingCurrentUser = followings.find(item => item.user_id === user_session_data.id) ? true : false
    }
    return {
      ...userDetail,
      postsCount: 0,
      likesCount: 0,
      followingCount: followings.length,
      followersCount: followers.length,
      currentUserIsFollower,
      isFollowingCurrentUser
    }
  }
}


export const isUserExists = async (username) => {
  const [user] = await db.select({ id: users.id, username: users.username, password: users.password }).from(users).where(eq(users.username, username));
  return user
}

export const handlePasswordHash = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSaltSync(saltRounds);
  const passwordHash = await bcrypt.hashSync(password, salt);
  return { passwordHash, salt }
}