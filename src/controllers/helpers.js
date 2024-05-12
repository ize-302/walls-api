import { eq } from "drizzle-orm"
import { follows, likes, posts, comments, profiles, users } from "../db/schema.js"
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
 * @param {string} username
 * @returns user object if user found or send a 404 status code
 */
export const fetchUserDetailByUsername = async (req, res, username) => {
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

  if (userDetail !== undefined) {
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
  } else {
    return null
  }
}


/**
 * Given a post id, fetch the likes for the specified post_id
 *
 * @async
 * @param {string} post_id
 * @returns {unknown}
 */
export const fetchLikesByPostId = async (post_id) => {
  const likesResponse = await db.select().from(likes).where(eq(likes.parent_id, post_id))
  return likesResponse
}

/**
 * Given a post id, fetch the comments for the specified post_id
 *
 * @async
 * @param {string} post_id
 * @returns {unknown}
 */
export const fetchPostCommentsByPostId = async (post_id) => {
  const commentsResponse = await db.select().from(comments).where(eq(comments.parent_id, post_id))
  return commentsResponse
}


/**
 * Given a post id, return the detail for that post, including author details
 *
 * @async
 * @param {string} post_id
 * @param {string} current_user_id
 * @returns {unknown}
 */
export const fetchPostDetail = async (post_id, current_user_id) => {
  const likesCountResponse = await fetchLikesByPostId(post_id)
  const commentsCountResponse = await fetchPostCommentsByPostId(post_id)
  let currentUserLiked = false
  if (current_user_id) {
    currentUserLiked = likesCountResponse.find(item => item.author_id === current_user_id) ? true : false
  }
  const [result] = await db.select({
    id: posts.id,
    message: posts.message,
    created: posts.created,
    author_id: posts.author_id,
    author_username: users.username,
    author_displayName: profiles.displayName,
    author_avatar_url: profiles.avatar_url,
  }).from(posts).where(eq(posts.id, post_id))
    .leftJoin(profiles, eq(profiles.userid, posts.author_id))
    .leftJoin(users, eq(users.id, posts.author_id))
  if (result !== undefined) {
    return { ...result, likesCount: likesCountResponse.length, commentsCount: commentsCountResponse.length, currentUserLiked }
  } else {
    return undefined
  }
}


/**
 * Given an array of post ids, we fetch detail for each indivial post
 *
 * @async
 * @param {string} post_ids
 * @param {string} current_user_id
 * @returns {unknown}
 */
export const fetchPosts = async (post_ids, current_user_id) => {
  try {
    const res = await Promise.all(
      post_ids.map(post_id => fetchPostDetail(post_id, current_user_id))
    );
    return res
  } catch (error) {
    throw Error("Promise failed");
  }
}


/**
 * This is used to get details of a user who liked a post
 *
 * @async
 * @param {string} author_id
 * @param {string} current_user_id
 * @returns {unknown}
 */
export const fetchAuthorDetailById = async (author_id, current_user_id) => {
  const [userDetail] = await db.select({
    id: users.id,
    username: users.username,
    displayName: profiles.displayName,
    avatar_url: profiles.avatar_url
  }).from(users).where(eq(users.id, author_id)).leftJoin(profiles, eq(profiles.userid, author_id))

  if (userDetail !== undefined) {
    const followings = await db.select().from(follows).where(eq(follows.followed_by, author_id))
    let isFollowingCurrentUser = false
    if (current_user_id) {
      isFollowingCurrentUser = followings.find(item => item.user_id === current_user_id) ? true : false
    }
    return {
      ...userDetail,
      isFollowingCurrentUser
    }
  } else {
    return null
  }
}

/**
 * Given an array of author_ids, we fetch and return the detail of each  author
 *
 * @async
 * @param {string} author_ids
 * @param {string} current_user_id
 * @returns {unknown}
 */
export const fetchLikesAuthors = async (author_ids, current_user_id) => {
  try {
    const res = await Promise.all(
      author_ids.map(author_id => fetchAuthorDetailById(author_id, current_user_id))
    );
    return res
  } catch (error) {
    throw Error("Promise failed");
  }
}


/**
 * DB query to return user details if user exists, it acepts username as argument
 *
 * @async
 * @param {string} username
 * @returns {unknown}
 */
export const isUserExists = async (username) => {
  const [user] = await db.select({ id: users.id, username: users.username, password: users.password }).from(users).where(eq(users.username, username));
  return user
}


/**
 * Self explanatory I suppose
 *
 * @async
 * @param {string} password
 * @returns {unknown}
 */
export const handlePasswordHash = async (password) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSaltSync(saltRounds);
  const passwordHash = await bcrypt.hashSync(password, salt);
  return { passwordHash, salt }
}


/**
 * General error handler
 *
 * @async
 * @param {*} res
 * @param {*} error
 * @param {string} customErrorMessage
 * @returns {unknown}
 */
export const handleErrors = async (res, error, customErrorMessage) => {
  if (error.errors) {
    return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] ?? customErrorMessage });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
}