import dotenv from "dotenv";

import connectDB from "./db/db.js";
import app from "./app.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8000;

(async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Database connection error!", error);
  }
})();
