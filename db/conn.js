const mongoose = require("mongoose");

const DB =
  "mongodb+srv://imarszone369:CI2C86yKYtpKeIHD@cluster0.cvwq9.mongodb.net/imarszone_db?retryWrites=true&w=majority&appName=Cluster0";

const connectDatabase = async () => {
  try {
    await mongoose.connect(DB);
    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDatabase();
