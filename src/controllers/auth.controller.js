const { eq } = require("drizzle-orm");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {
  ReasonPhrases,
  StatusCodes,
} = require('http-status-codes');

const { registrationSchema, loginSchema } = require("../schemas");
const { db } = require("../db");
const { users } = require("../db/schema");
const { JWT_SECRET } = require('../config');


class AuthController {
  static async register(req, res) {
    try {
      await registrationSchema.validate(req.body)
      // check if user with username exists and return error message if true
      const user_exists = await db.select().from(users).where(eq(users.username, req.body.username));
      if (user_exists.length) return res.status(409).json({ success: false, message: 'User with username already exists' });
      // use bcrypt library to hash password
      const saltRounds = 10;
      const salt = await bcrypt.genSaltSync(saltRounds);
      const hash = await bcrypt.hashSync(req.body.password, salt);
      // finally create user
      await db.insert(users).values({ ...req.body, password: hash });
      res
        .status(StatusCodes.OK)
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
      // generate and return token
      const token = await jwt.sign({
        data: { id: user_exists[0].id, username: user_exists[0].username }
      }, JWT_SECRET, { expiresIn: '1h' });
      res.status(StatusCodes.OK).json({
        accessToken: token
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

module.exports = AuthController