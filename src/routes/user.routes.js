import express from "express";

import upload from "../middlewares/multer.middleware.js";

import { register, login } from "../controllers/user.controllers.js";

const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  register
);

router.route("/login").post(login);

export default router;
