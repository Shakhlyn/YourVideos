import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: DB:${connection.connection.host}`);
  } catch (error) {
    console.error(`\nMongoDb connection error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
