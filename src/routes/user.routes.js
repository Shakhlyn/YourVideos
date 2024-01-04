import express from "express";

import upload from "../middlewares/multer.middleware.js";

import { register } from "../controllers/user.controllers.js";

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

export default router;
