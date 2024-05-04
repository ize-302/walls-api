import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';
import { uuid } from 'uuidv4'
import yup from 'yup'


import { db } from "../db/index.js";
import { users, profiles } from "../db/schema.js";

const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
})

const registrationSchema = yup.object({
  username: yup.string().matches(/^[\w-]+$/, 'Username can only contain alphanumeric characters, dashes, and underscores').required('Username is required'),
  password: yup.string().required('Password is required'),
})


class AuthController {
  static async register(req, res) {
    try {
      await registrationSchema.validate(req.body)
      // check if user with username exists and return error message if true
      const user_exists = await db.select().from(users).where(eq(users.username, req.body.username));
      if (user_exists.length) return res.status(StatusCodes.CONFLICT).json({ success: false, message: 'User with username already exists' });
      // use bcrypt library to hash password
      const saltRounds = 10;
      const salt = await bcrypt.genSaltSync(saltRounds);
      const hash = await bcrypt.hashSync(req.body.password, salt);
      // finally create user
      const new_user = await db.insert(users).values({ ...req.body, password: hash }).returning();
      // update avatar
      const result = await db
        .insert(profiles)
        .values({ userid: new_user[0].id, avatar_url: `https://api.dicebear.com/8.x/pixel-art/svg?seed=${req.body.username}` })
        .onConflictDoUpdate({
          target: profiles.userid,
          set: { avatar_url: `https://api.dicebear.com/8.x/pixel-art/svg?seed=${req.body.username}` },
        });
      res
        .status(StatusCodes.CREATED)
        .json({ success: true, message: "Account has been created. Proceed to login" });
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    }
  }

  static async login(req, res) {
    try {
      await loginSchema.validate(req.body)
      // check if user with username exists and return error message if false
      const user_exists = await db.select().from(users).where(eq(users.username, req.body.username));
      if (user_exists.length == 0) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Incorrect username / password' });
      // password match?
      const match = await bcrypt.compare(req.body.password, user_exists[0].password);
      if (!match) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Incorrect username / password' });
      const sessionId = uuid()
      req.session.clientId = sessionId;
      req.session.user = {
        id: user_exists[0].id,
        username: user_exists[0].username
      }
      res.status(StatusCodes.OK).send({ success: true, message: 'You are now logged in' })
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    }
  }

  static async logout(req, res) {
    try {
      req.session.destroy();
      res.status(StatusCodes.OK).send({ success: true, message: 'You are now logged out' })
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  }
}

export default AuthController