// const mongoose = require("mongoose");
// const env = require("dotenv");

// env.config();

// const dbconnection = async () => {
//     mongoose
//         .connect(process.env.MONGODB_URL)
//         .then(() => console.log("Database connected"))
//         .catch((err) => console.error(err));
//     };

// module.exports = dbconnection;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = connectDB;