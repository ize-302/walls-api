import { eq, ne } from "drizzle-orm";
import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';
import yup from 'yup'
import bcrypt from "bcrypt";

import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { handlePasswordHash, isUserExists } from "./helpers.js";

const changeUsernameSchema = yup.object({
  username: yup.string().matches(/^[\w-]+$/, 'Username can only contain alphanumeric characters, dashes, and underscores').required('Username is required'),
})

const changePasswordSchema = yup.object({
  currentPassword: yup.string().required('Current password is required'),
  newPassword: yup.string().required('New password is required'),
})

class SettingsController {
  static async changeUsername(req, res) {
    try {
      await changeUsernameSchema.validate(req.body)
      const { user: user_session_data } = req.session
      const { username } = req.body
      const user = await isUserExists(username)
      if (user !== undefined && user.id != user_session_data.id) return res.status(StatusCodes.CONFLICT).json({ success: false, message: 'Username is already in use' });

      const [result] = await db
        .update(users)
        .set({ username })
        .where(eq(users.id, user_session_data.id))
        .returning({ username: users.username });

      res.status(StatusCodes.OK).json({
        success: true,
        data: result
      });
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    }
  }

  static async changePassword(req, res) {
    try {
      await changePasswordSchema.validate(req.body)
      const { user: user_session_data } = req.session
      const { currentPassword, newPassword } = req.body

      if (!currentPassword && !newPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Provide current and new password' });
      }

      // current user
      const current_user = await db.select({ password: users.password }).from(users).where(eq(users.id, user_session_data.id));
      const match = await bcrypt.compare(currentPassword, current_user[0].password);
      if (!match) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Incorrect current password' });

      const { passwordHash } = await handlePasswordHash(newPassword)

      await db
        .update(users)
        .set({ password: passwordHash })
        .where(eq(users.id, user_session_data.id))

      res.status(StatusCodes.OK).json({
        success: true,
        data: 'Password changed succesfully'
      });
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    }
  }
}

export default SettingsController