import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

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
    fs.unlinkSync(filePath);

    // investigative reason: This must be deleted after seeing what is in this response.
    console.log(response);

    return response;
  } catch (error) {
    // if uploading is failed, at first remove the unfinished along with corrupted files from the storage.
    fs.unlinkSync(filePath);

    return null;
  }
};

export default uploadOnCloudinary;
