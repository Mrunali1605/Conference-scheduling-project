const express = require("express");
const router = express.Router();
const Speaker = require("../Models/Speaker");
const auth = require("../Middleswares/auth");
const adminMiddleware = require("../Middleswares/adminMiddleware");
// Add speaker (admin only)
router.post("/add", auth, adminMiddleware, async (req, res) => {
  try {
    const { name, topic, bio, image, eventId } = req.body;
    console.log("Received speaker data:", req.body);
    if (!name || !topic || !bio || !eventId) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const speaker = new Speaker({
      name,
      topic,
      bio,
      image,
      eventId,
      createdBy: req.user._id,
    });

    const savedSpeaker = await speaker.save();
    res.status(201).json(savedSpeaker);
  } catch (error) {
    console.error("Server error:", error);
    res
      .status(500)
      .json({ message: "Error adding speaker", error: error.message });
  }
});

// Get speakers by event ID
router.get("/event/:eventId", async (req, res) => {
  try {
    const speakers = await Speaker.find({ eventId: req.params.eventId });
    res.status(200).json(speakers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching speakers", error: error.message });
  }
});

// Delete speaker (admin only)
router.delete("/:id", auth, adminMiddleware, async (req, res) => {
  try {
    const deletedSpeaker = await Speaker.findByIdAndDelete(req.params.id);
    if (!deletedSpeaker) {
      return res.status(404).json({ message: "Speaker not found" });
    }
    res.status(200).json({ message: "Speaker deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting speaker", error: error.message });
  }
});

// Add this route to get all speakers
router.get("/", async (req, res) => {
  try {
    const speakers = await Speaker.find()
      .populate('eventId', 'title start')
      .sort({ createdAt: -1 });
    res.status(200).json(speakers);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching speakers", 
      error: error.message 
    });
  }
});
module.exports = router;
