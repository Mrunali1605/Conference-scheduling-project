const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
require("dotenv").config();

// Import Models - Add these lines before routes
const User = require("./Models/User");
const Event = require("./Models/Event");
const Venue = require('./Models/Venue');
const Speaker = require("./Models/Speaker");

// Import Routes
const authRoutes = require("./Routes/AuthRouter");
const eventRoutes = require("./Routes/eventRoutes");
const userRoutes = require("./Routes/userRoutes");
const speakerRoutes = require("./Routes/SpeakerRoutes");
const venueRoutes = require('./Routes/VenueRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);
app.use("/api/speakers", speakerRoutes);
app.use('/api/venues', venueRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
