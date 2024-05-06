import {
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { createId } from '@paralleldrive/cuid2';

// enums
export const genderEnum = { enum: ['male', 'female', 'other', ''] };

//  tables
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    username: text("username"),
    password: text("password"),
  },
  (users) => ({
    usernameIndex: uniqueIndex("usernameIndex").on(users.username),
  })
);

export const profiles = sqliteTable(
  "profiles",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userid: text('userid'),
    email: text('email'),
    displayName: text("displayName"),
    bio: text("bio", { length: 150 }),
    gender: text('gender', genderEnum),
    avatar_url: text('avatar_url')
  },
  (profiles) => ({
    userIdIndex: uniqueIndex("userIdIndex").on(profiles.userid),
  })
);

export const follows = sqliteTable("follows", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  followed_id: text('followed_id'),
  follower_id: text('follower_id'),
},
  (follows) => ({
    idIndex: uniqueIndex("idIndex").on(follows.id),
  })
)
