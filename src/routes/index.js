const { Router } = require('express')
const pjson = require('../../package.json');
const authRoute = require("./auth.route");

const mainRoute = Router();

mainRoute.get("/", (req, res) =>
  res.status(200).json({ api_version: '/api/v1', explicit_version: pjson.version })
);

mainRoute.use("/auth", authRoute);

module.exports = mainRoute
