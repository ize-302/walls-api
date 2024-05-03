const {
  sqliteTable,
  text,
  uniqueIndex,
} = require("drizzle-orm/sqlite-core");
const { createId } = require('@paralleldrive/cuid2');

// enums
const genderEnum = { enum: ['male', 'female', 'other', ''] };

//  tables
const users = sqliteTable(
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

const profiles = sqliteTable(
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

module.exports = { users, profiles, genderEnum }