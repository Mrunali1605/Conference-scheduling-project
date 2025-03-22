const Venue = require("../Models/Venue");
const Event = require("../Models/Event");
// Get all venues
exports.getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.find()
      .populate("eventId", "title start")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching venues",
      error: error.message,
    });
  }
};

// Create new venue
exports.createVenue = async (req, res) => {
  try {
    const { name, address, capacity, facilities, eventId } = req.body;
    if (!name || !address || !capacity || !facilities || !eventId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    // const venue = new Venue(req.body);
    const venue = new Venue({
      name,
      address,
      capacity: parseInt(capacity),
      facilities,
      eventId,
      createdBy: req.user._id,
    });
    const savedVenue = await venue.save();

    const populatedVenue = await Venue.findById(savedVenue._id)
      .populate("eventId", "title start")
      .populate("createdBy", "name");

    res.status(201).json(populatedVenue);
    // res.status(201).json(savedVenue);
  } catch (error) {
    console.error("Venue creation error:", error);
    res.status(500).json({
      message: "Error creating venue",
      error: error.message,
    });
  }
};

// Get venue by ID
exports.getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id).populate("eventId");
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update venue
exports.updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.status(200).json(venue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete venue
exports.deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.status(200).json({ message: "Venue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
