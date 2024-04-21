const {
  text,
  uniqueIndex,
  pgTable,
  varchar,
  pgEnum,
  json,
  timestamp
} = require("drizzle-orm/pg-core");
const { createId } = require('@paralleldrive/cuid2');

// enums
const genderEnum = pgEnum('gender', ['male', 'female', 'other', '']);

//  tables
const users = pgTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    username: text('username'),
    password: text("password"),
  },
  (users) => ({
    usernameIndex: uniqueIndex("usernameIndex").on(users.username),
  })
);

const profiles = pgTable(
  "profiles",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    userid: text('userid'),
    email: text('email'),
    name: text("name"),
    bio: varchar("bio", { length: 150 }),
    gender: genderEnum('gender'),
  },
  (profiles) => ({
    userIdIndex: uniqueIndex("userIdIndex").on(profiles.userid),
  })
);

module.exports = { users, profiles, genderEnum }