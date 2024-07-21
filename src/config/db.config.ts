import mongoose from "mongoose";

const connectDB = async (uri: string) => {
  try {
    const conn = await mongoose.connect(uri);

    console.log(`Database connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};


export default connectDB