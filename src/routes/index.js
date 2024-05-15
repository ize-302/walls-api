import { Router } from 'express'
import pjson from '../../package.json' assert { type: 'json' };

import authRoute from "./auth.route.js";
import profileRoute from "./profile.route.js";
import settingsRoute from "./settings.route.js";
import usersRoute from './users.route.js';
import postsRoute from './posts.route.js';
import likesRoute from './likes.route.js';

import { BASE_PATH } from '../config.js';

const mainRoute = Router();

mainRoute.get("/", (req, res) =>
  res.status(200).json({ api_version: BASE_PATH, explicit_version: pjson.version })
);

mainRoute.use("/", authRoute);
mainRoute.use("/profile", profileRoute);
mainRoute.use("/settings", settingsRoute);
mainRoute.use("/users", usersRoute);
mainRoute.use("/posts", postsRoute);
mainRoute.use("/likes", likesRoute);

export default mainRoute