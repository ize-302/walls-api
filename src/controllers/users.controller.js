import { eq } from "drizzle-orm";
import {
  ReasonPhrases,
  StatusCodes,
} from 'http-status-codes';
import yup from 'yup'

import { db } from "../db/index.js";
import { users, profiles } from "../db/schema.js";

class UsersController {
  static async getUserProfile(req, res) {
    try {
      const { user: user_session_data } = req.session
      res
        .status(StatusCodes.OK)
        .json({ success: true, data: {} });
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    }
  }

  static async followUser(req, res) {
    try {
      const { user: user_session_data } = req.session
      res.status(StatusCodes.OK).json({
        success: true,
      });
    } catch (error) {
      if (error.errors) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: error.errors[0] });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
      }
    }
  }

  static async unfollowUser(req, res) {
    try {
      const { user: user_session_data } = req.session
      res.status(StatusCodes.OK).json({
        success: true,
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

export default UsersController