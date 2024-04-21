const { eq, ne } = require("drizzle-orm");
const {
  ReasonPhrases,
  StatusCodes,
} = require('http-status-codes');
const yup = require('yup')

const { db } = require("../db");
const { users } = require("../db/schema");


const changeUsernameSchema = yup.object({
  username: yup.string().matches(/^[\w-]+$/, 'Username can only contain alphanumeric characters, dashes, and underscores').required('Username is required'),
})

class SettingsController {
  static async changeUsername(req, res) {
    try {
      await changeUsernameSchema.validate(req.body)
      const { user: user_session_data } = req.session
      const { username } = req.body

      // check if username is already in use by another user
      const user_exists = await db.select({ username: users.username, id: users.id }).from(users).where(eq(users.username, username));
      if (user_exists.length > 0 && user_exists[0].id != user_session_data.id) return res.status(StatusCodes.CONFLICT).json({ success: false, message: 'Username is already in use' });

      const result = await db
        .update(users)
        .set({ username })
        .where(eq(users.id, user_session_data.id))
        .returning({ newUsername: users.username });

      res.status(StatusCodes.OK).json({
        success: true,
        data: result[0]
      });
    } catch (error) {
      console.error(error)
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    }
  }
}

module.exports = SettingsController