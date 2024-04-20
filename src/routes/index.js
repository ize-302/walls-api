const { Router } = require('express')
const pjson = require('../../package.json');
const authRoute = require("./auth.route");
const { BASE_PATH } = require('../config')

const mainRoute = Router();

mainRoute.get("/", (req, res) =>
  res.status(200).json({ api_version: BASE_PATH, explicit_version: pjson.version })
);

mainRoute.use("/auth", authRoute);

module.exports = mainRoute
