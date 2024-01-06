import dotenv from "dotenv";

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// We have to configure dotenv again, otherwise cloudinary can’ access environment variables.
dotenv.config({
  path: "./.env",
});

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// uploading function is held in a variable so that I can reuse it whenever I need.
const uploadOnCloudinary = async (filePath) => {
  try {
    if (!filePath) return null;

    // if exist, upload the file:
    const response = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // after uploading the files, remove the file by 'unlinking'

    //it must be done before returning. Hence, ‘synchronous’.
    fs.unlinkSync(filePath);

    return response;
  } catch (error) {
    // if uploading is failed, at first remove the unfinished along with corrupted files from the storage.

    //it must be done before returning. Hence, ‘synchronous’.
    fs.unlinkSync(filePath);

    // and return null so that we can handle this errors where will use cloudinary
    return null;
  }
};

export default uploadOnCloudinary;
