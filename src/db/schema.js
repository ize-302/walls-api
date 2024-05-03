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
    name: text("name"),
    bio: text("bio", { length: 150 }),
    gender: text('gender', genderEnum),
  },
  (profiles) => ({
    userIdIndex: uniqueIndex("userIdIndex").on(profiles.userid),
  })
);

module.exports = { users, profiles, genderEnum }