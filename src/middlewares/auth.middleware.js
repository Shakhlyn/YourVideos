import jwt from "jsonwebtoken";

import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";

import User from "../models/user.model.js";

export const protect = catchAsync(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "You are not logged-in. Please log in first");
    }

    const decodedTokenObject = jwt.verify(
      token,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedTokenObject._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // if everything is OK, "set user to req.user" so that we can access user anytime we need.
    req.user = user;
    next();
  } catch (error) {
    console.log(`Authentication error from protect. Error: ${error}`);
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
