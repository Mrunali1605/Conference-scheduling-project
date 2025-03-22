const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    registeredUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    venue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      default: null,
      // required: true,
    },
    speakers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Speaker", default: [] },
    ],
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

// Add validation for dates
eventSchema.pre("save", function (next) {
  if (this.start >= this.end) {
    return next(new Error("Event end time must be after start time"));
  }
  if (!this.venue) {
    this.venue = null;
  }
  console.log("Saving event with venue:", this.venue);
  next();
});
module.exports = mongoose.model("Event", eventSchema);
