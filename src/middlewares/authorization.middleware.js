const {
  StatusCodes,
} = require('http-status-codes');

const authorizationMiddleware = (req, res, next) => {
  if (!req.session || !req.session.clientId) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: "Unauthorised! Please log in to continue" });
  }
  next();
};

module.exports = authorizationMiddleware