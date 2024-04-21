const { eq } = require("drizzle-orm");
const {
  ReasonPhrases,
  StatusCodes,
} = require('http-status-codes');

const { db } = require("../db");
const { users, profiles, genderEnum } = require("../db/schema");
const profileUpdateSchema = require("../schemas/profileupdate.schema");

class ProfileController {
  static async get(req, res) {
    try {
      const { user: user_session_data } = req.session
      const result = await db.select({
        id: users.id,
        username: users.username,
        email: profiles.email,
        name: profiles.name,
        bio: profiles.bio,
        gender: profiles.gender
      }).from(users).where(eq(users.id, user_session_data.id)).leftJoin(profiles, eq(users.id, profiles.userid))
      res
        .status(StatusCodes.OK)
        .json({ success: true, data: result[0] });
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    }
  }

  static async update(req, res) {
    try {
      await profileUpdateSchema.validate(req.body)
      const { user: user_session_data } = req.session
      const { name, email, gender, bio } = req.body

      const result = await db
        .insert(profiles)
        .values({ userid: user_session_data.id, name, email, bio, gender })
        .onConflictDoUpdate({
          target: profiles.userid,
          set: { name, email, bio, gender },
        }).returning();

      delete result[0].id
      delete result[0].userid

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

module.exports = ProfileController