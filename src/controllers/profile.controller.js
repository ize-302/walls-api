import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';
import yup from 'yup'

import { db } from "../db/index.js";
import { profiles } from "../db/schema.js";
import { fetchUserDetail } from "./helpers.js";

const profileUpdateSchema = yup.object({
  displayName: yup.string(),
  email: yup.string().email(),
  gender: yup.string(),
  bio: yup.string().max(150, 'Bio cannot be more than 150 characters'), // when changing this, dont forgrt to update column on db schema 
})

class ProfileController {
  static async get(req, res) {
    try {
      const { user: user_session_data } = req.session
      const user = await fetchUserDetail(req, res, user_session_data.username)
      res
        .status(StatusCodes.OK)
        .json({
          success: true, data: user
        });

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
      const { displayName, email, gender, bio } = req.body

      const result = await db
        .insert(profiles)
        .values({ userid: user_session_data.id, displayName, email, bio, gender })
        .onConflictDoUpdate({
          target: profiles.userid,
          set: { displayName, email, bio, gender },
        }).returning({ displayName: profiles.displayName, email: profiles.email, bio: profiles.bio, gender: profiles.gender });

      res.status(StatusCodes.OK).json({
        success: true,
        data: result[0]
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

export default ProfileController