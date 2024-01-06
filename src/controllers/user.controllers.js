// model
import User from "../models/user.model.js";

// utils
import catchAsync from "../utils/catchAsync.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";

// cloudinary
import uploadOnCloudinary from "../utils/cloudinary.js";

const register = catchAsync(async (req, res) => {
  /*
  STEPS: 
1 - take input data from user
2 - validate if every field is present
3 - check if user already exists: username and email. If exists, throw error
4 - check for image, cover photo
5 - upload file into cloudinary
6 - create user object with create method
7 - after creating the user object, remove password and refreshtoken before sending the response data to the user.
8 - check for creation. If not created, we will get null
9 - send response if everything is ok.
 */

  // take input data from user
  const { fullName, email, username, password } = req.body;

  // validate if every field is present
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // check if user(username and email) already exists. If exist, throw error
  const existingUser = await User.findOne({
    // either username or email is found in the database, it will show the user.
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "User with provided email or username already exists. Please log in, or register with different credentials."
    );
  }

  // check for avatar and cover photo
  const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  // upload file into cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    // throw new ApiError(400, "Avatar file is required");

    // Since, it is not, most probably, user's fault.
    throw new ApiError(
      500,
      "Something went wrong. Please try registering again."
    );
  }

  // create user object with create method
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  // after creating the user object, remove password and refreshtoken before sending the response data to the user.
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // check for creation. If not created, throw error
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong. Please try again");
  }

  // send response if everything is ok.

  res
    .status(201)
    .json(new ApiResponse(201, createdUser, "Registration successful"));
});

const login = catchAsync(async (req, res) => {
  /*
  STEPS:
  1 - take data from user through req.body
  2 - check if fields are not blank
  3 - find the user with either username or email
  4 - check if the given password is correct
  5 - generate accessToken & refreshtoken; save the accessToken in the db
  6 - optional, but useful -- set "req.user = user"
  7 - send accessToken and refreshToken to the user through the cookie
  */

  // 1.take data
  const { username, email, password } = req.body;

  // 2. check if the fields are given
  if (!username || !email) {
    throw new ApiError(400, "Both fields are needed");
  }

  // 3. find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(401, "Invalid user credentials");
    // we don't want to give hint to the user, probably hacker, what is the problem.
    // Hence, for both invalid user and password, we're sending the same code and message.
  }

  // 4. check if the password is correct
  const isValidPassword = await user.isPasswordCorrect(password);

  if (!isValidPassword) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // 5. Generate tokens

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  ); //before sending user info, we must remove 'password' and 'refreshToke' from the response

  // 6. set req.user = loggedInUser

  // 7. return the response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
      },
      "Log-in is successful"
    )
  );
});

export { register, login };
