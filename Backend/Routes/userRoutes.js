const express = require("express");
const User = require("../Models/User");

const router = express.Router();

// Fetch all registered users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
