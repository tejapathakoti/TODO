import mongoose from "mongoose";

// Set up global promise implementation
mongoose.Promise = global.Promise;

// Define the MongoDB connection URL
const dbURL: string = "mongodb://127.0.0.1:27017/TodoLists";

// Attempt to connect to MongoDB
mongoose.connect(dbURL)
  .then(() => {
    console.log("Connected successfully to MongoDB");
  })
  .catch((e: Error) => {
    console.error("Error while connecting to MongoDB: ", e);
  });

export default mongoose;
