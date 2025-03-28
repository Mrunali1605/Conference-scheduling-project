const express = require("express");
const router = express.Router();
const Event = require("../Models/Event");
const User = require("../Models/User");
const auth = require("../Middleswares/auth");
const { getAllEvents } = require("../Controllers/EventController");

router.get("/", getAllEvents);
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
});

// Update the getAllEvents route
router.get("/", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("createdBy", "name")
      .populate("speakers")
      .sort({ start: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    console.log("Received event creation request:", req.body);
    console.log("Venue ID from request:", req.body.venue);
    console.log("Authenticated user:", req.user);
    const {
      title,
      description,
      start,
      end,
      venue,
      location,
      capacity,
      speakers,
      createdBy,
    } = req.body;

    // Validate required fields
    if (!title || !description || !start || !end || !location || !capacity) {
      return res.status(400).json({
        error: "All fields are required",
        missing: {
          title: !title,
          description: !description,
          start: !start,
          end: !end,
          location: !location,
          capacity: !capacity,
        },
      });
    }

    const newEvent = new Event({
      title,
      description,
      start: new Date(start),
      end: new Date(end),
      location,
      capacity: parseInt(capacity),
      createdBy: req.user._id,
      // speakers: [],
      venue: venue || null,
      speakers: speakers || [],
      registeredUsers: [],
    });
    console.log("Created event object:", newEvent);
    const savedEvent = await newEvent.save();
    console.log("Saved event:", savedEvent);
    const populatedEvent = await Event.findById(savedEvent._id)
      .populate("createdBy", "name email")
      .populate({
        path: "speakers",
        select: "name topic bio",
      })
      .populate({
        path: "venue",
        select: "name address capacity facilities",
      });
    // .populate("speakers");

    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(400).json({
      message: error.message || "Failed to create event",
      error: error.message,
      stack: error.stack,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const {
      title,
      description,
      start,
      end,
      location,
      capacity,
      speakers,
      venue,
    } = req.body;

    // Validate required fields
    if (!title || !description || !start || !end || !location || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        start: new Date(start),
        end: new Date(end),
        location,
        capacity: parseInt(capacity),
        speakers: speakers || [],
        venue: venue || null,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("createdBy", "name email")
      .populate("speakers")
      .populate({
        path: "venue",
        select: "name address capacity facilities",
      });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(400).json({
      message: "Error updating event",
      error: error.message,
    });
  }
});

// Delete event
router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this route to handle registrations
router.post("/:id/register", auth, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;
    console.log("Registration request received:", {
      eventId,
      userId,
      body: req.body,
    });

    const { name, email, age, qualification, workingStatus } = req.body;

    // Validate required fields
    if (!name || !email || !age || !qualification || !workingStatus) {
      console.log("Missing required fields:", {
        name,
        email,
        age,
        qualification,
        workingStatus,
      });
      return res.status(400).json({ message: "Missing required fields" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isRegistered = event.registeredUsers.some(
      (reg) => reg.user.toString() === userId.toString()
    );
    if (isRegistered) {
      return res
        .status(400)
        .json({ message: "Already registered for this event" });
    }

    // Check capacity
    if (event.registeredUsers.length >= event.capacity) {
      return res.status(400).json({ message: "Event is full" });
    }
    // Add registration with details
    const registration = {
      user: userId,
      name,
      email,
      age,
      qualification,
      workingStatus,
      registrationDate: new Date(),
    };

    event.registeredUsers.push(registration);
    await event.save();

    res.status(200).json({
      message: "Registration successful",
      registration: event.registeredUsers[event.registeredUsers.length - 1],
      // registration,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Failed to register for event",
      error: error.message,
    });
  }
});

// Add route to get user's registrations
router.get("/user/registrations", auth, async (req, res) => {
  try {
    const events = await Event.find({
      "registeredUsers.user": req.user._id,
    }).populate("venue");

    const registrations = events.flatMap((event) => {
      const userRegistrations = event.registeredUsers.filter(
        (reg) => reg.user.toString() === req.user._id.toString()
      );
      return userRegistrations.map((reg) => ({
        _id: reg._id,
        name: reg.name,
        email: reg.email,
        age: reg.age,
        qualification: reg.qualification,
        workingStatus: reg.workingStatus,
        registrationDate: reg.registrationDate,
        event: {
          _id: event._id,
          title: event.title,
          start: event.start,
          end: event.end,
          venue: event.venue,
        },
      }));
    });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch registrations",
      error: error.message,
    });
  }
});
module.exports = router;
