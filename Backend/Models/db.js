const mongoose = require("mongoose");
require("dotenv").config();

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", true);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connection Successfully");
  })
  .catch((err) => {
    console.log("Connection Failed:", err.message);
  });

module.exports = mongoose;

