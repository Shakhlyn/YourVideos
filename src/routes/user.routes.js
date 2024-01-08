import express from "express";

import upload from "../middlewares/multer.middleware.js";

import { protect } from "../middlewares/auth.middleware.js";

import {
  register,
  login,
  logout,
  testUserController,
} from "../controllers/user.controllers.js";

const router = express.Router();

// testing route
router.route("/testing").get(protect, testUserController);
// testing route

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
router.route("/logout").post(protect, logout);

export default router;
