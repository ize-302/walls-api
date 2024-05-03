import {
  StatusCodes,
} from 'http-status-codes';

const authenticationMiddleware = (req, res, next) => {
  if (!req.session || !req.session.clientId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorised! Please log in to continue" });
  }
  next();
};

export default authenticationMiddleware