import {
  StatusCodes,
} from 'http-status-codes';

const authenticationMiddleware = (req, res, next) => {
  if (!req.session || !req.session.clientId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, error: "Unauthorised! Please log in to continue" });
  }
  next();
};

export const authenticationMiddlewareOptional = (req, res, next) => {
  next();
};

export default authenticationMiddleware