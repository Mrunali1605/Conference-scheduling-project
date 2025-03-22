const express = require("express");
const router = express.Router();
const Event = require("../Models/Event");
const auth = require("../Middleware/auth");

// Get all events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("speakers")
      .populate("createdBy", "name email")
      .sort({ start: 1 });
    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch events", error: error.message });
  }
});

// Create new event (admin only)
router.post("/", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Only admins can create events" });
    }

    const event = new Event({
      ...req.body,
      createdBy: req.user._id,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create event", error: error.message });
  }
});

// Register for an event
router.post("/:id/register", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if user is already registered
    if (event.registeredUsers.includes(req.user._id)) {
      return res
        .status(400)
        .json({ message: "Already registered for this event" });
    }

    // Check event capacity
    if (event.registeredUsers.length >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Check if event date has passed
    if (new Date(event.start) < new Date()) {
      return res.status(400).json({ message: "Event has already started" });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

    res.json({
      message: "Successfully registered for event",
      event: {
        title: event.title,
        start: event.start,
        location: event.location,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
});

// Get event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("speakers")
      .populate("createdBy", "name email")
      .populate("registeredUsers", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch event", error: error.message });
  }
});

// Update event (admin only)
router.put("/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Only admins can update events" });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update event", error: error.message });
  }
});

// Delete event (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Only admins can delete events" });
    }

    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete event", error: error.message });
  }
});

// Get registered users for an event (admin only)
router.get("/:id/registrations", auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admins can view registrations" });
    }

    const event = await Event.findById(req.params.id).populate(
      "registeredUsers",
      "name email"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event.registeredUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch registrations", error: error.message });
  }
});

module.exports = router;
