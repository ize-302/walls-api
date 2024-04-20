const {
  text,
  uniqueIndex,
  pgTable
} = require("drizzle-orm/pg-core");
const { createId } = require('@paralleldrive/cuid2');

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


module.exports = { users }