import { eq } from "drizzle-orm"
import { profiles, users } from "../db/schema.js"
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
export const fetchUserDetail = async (res, username) => {
  const [userDetail] = await db.select({
    id: users.id,
    username: users.username,
    email: profiles.email,
    displayName: profiles.displayName,
    bio: profiles.bio,
    gender: profiles.gender,
    avatar_url: profiles.avatar_url
  }).from(users).where(eq(users.username, username)).leftJoin(profiles, eq(users.id, profiles.userid))
  if (userDetail === undefined) return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: ReasonPhrases.NOT_FOUND });
  res
    .status(StatusCodes.OK)
    .json({ success: true, data: userDetail });
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