import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "'User name' is required"],
      unique: [
        true,
        "This user name exists in the system. Please try with another one",
      ],
      lowercase: true,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "'Email' is required"],
      unique: [
        true,
        "This email exists in the system. Please try with another email address",
      ],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [
        true,
        "Password is required and must be at least 4 characters long",
      ],
      minlength: 4,
    },

    fullName: {
      type: String,
      required: [true, "'Name' is required"],
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    uploadedVideos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// hash password with the help of 'bcrypt' package
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// checking if the password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); // return will be either 'true' or 'false'
};

// Define tokens

// indexing
// indexes of 'username' and 'email' will help '$or' operator to find the user in short time.
// Without this indexing, db will find from the whole collection
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });

userSchema.index({ watchHistory: 1 });
userSchema.index({ uploadedVideos: 1 });

const User = mongoose.model("User", userSchema);
export default User;
