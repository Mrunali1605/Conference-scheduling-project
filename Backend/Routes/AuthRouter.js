const router = require("express").Router();
const { signup, login } = require("../Controllers/AuthController");

const {
  signupValidation,
  loginValidation,
} = require("../Middleswares/AuthValidation");

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);

module.exports = router;

// const router = require("express").Router();
const auth = require("../Middleswares/auth");
const {
  createEvent,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
} = require("../Controllers/EventController");

router.post("/", auth, createEvent);
router.get("/", getAllEvents);
router.put("/:id", auth, updateEvent);
router.delete("/:id", auth, deleteEvent);
router.get("/:id/registrations", auth, getEventRegistrations);

module.exports = router;
