const { model } = require("mongoose");
const Event = require("../Models/Event");
const User = require("../Models/User");

const createEvent = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {
      title,
      description,
      start,
      end,
      venue,
      location,
      capacity,
      speakers,
    } = req.body;

    console.log("Received venue ID:", venue);

    if (!title || !description || !start || !end || !location || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("Received event data:", req.body);
    console.log("Creating event with venue:", venue);
    const newEvent = new Event({
      ...req.body,
      createdBy: req.user._id,
      speakers: [],
      venue: venue || null,
    });
    console.log("New event before save:", newEvent);
    const savedEvent = await newEvent.save();
    console.log("Saved event:", savedEvent);

    const populatedEvent = await Event.findById(savedEvent._id)
      .populate({
        path: "speakers",
        model: "Speaker",
      })
      .populate({
        path: "createdBy",
        model: "User",
        select: "name email",
      })
      .populate({
        path: "venue",
        select: "name address capacity facilities",
      });

    console.log("Created event:", populatedEvent);
    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error("Event creation error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      data: req.body,
    });
    res.status(500).json({
      message: "Error creating event",
      error: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("speakers")
      .populate("createdBy", "name email")
      .populate("venue");
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }
    console.log("Updated event:", updatedEvent);
    res.status(200).json(updatedEvent);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating event", error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      !req.user.isAdmin &&
      event.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({
      message: "Error deleting event",
      error: error.message,
    });
  }
};
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()

      .populate({
        path: "venue",
        select: "name address capacity facilities",
      })
      .populate("speakers")
      .populate("createdBy", "name")
      .populate({
        path: "registeredUsers",
        select: "name email age qualification workingStatus registrationDate",
      })
      // .populate("registeredUsers.user", "name email")
      .sort({ start: 1 })
      .select(
        "title description location capacity start end venue speakers createdBy"
      );
    console.log("Fetched events:", events);
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
};
const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "registrations.user",
      "name email"
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event.registrations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching registrations", error });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
};
