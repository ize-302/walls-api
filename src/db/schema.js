import {
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { createId } from '@paralleldrive/cuid2';
import { sql } from "drizzle-orm";

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
  user_id: text('user_id'),
  followed_by: text('followed_by'),
},
  (follows) => ({
    idIndex: uniqueIndex("idIndex").on(follows.id),
  })
)

export const posts = sqliteTable("posts", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  message: text("message").notNull(),
  author_id: text('author_id').notNull(),
  created: text("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
}, (posts) => ({
  postIdIndex: uniqueIndex("postIdIndex").on(posts.id),
}))

export const comments = sqliteTable("comments", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  message: text("message").notNull(),
  author_id: text('author_id').notNull(),
  created: text("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
  parent_id: text("parent_id")
}, (comments) => ({
  commenIdIndex: uniqueIndex("commenIdIndex").on(comments.id),
}))

export const likes = sqliteTable("likes", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  author_id: text('author_id').notNull(),
  created: text("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
  parent_id: text("parent_id")
}, (likes) => ({
  likeIdIndex: uniqueIndex("likeIdIndex").on(likes.id),
}))
