const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: function () {
      return this.email === "admin@example.com";
    },
  },
  registeredEvent: String,
});

module.exports = mongoose.model("User", userSchema);
