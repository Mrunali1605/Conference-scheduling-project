import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./UserSchedular.css";
import { handleError, handleSuccess } from "../../Utile";
import defaultSpeaker from "../../assets/defaultSpeaker.jpg";

const localizer = momentLocalizer(moment);

function UserSchedular() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    qualification: "",
    workingStatus: "",
  });
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleError("Authentication required");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await axios.get("http://localhost:8080/api/events", {
        headers,
      });

      const formattedEvents = response.data.map((event) => ({
        _id: event._id,
        title: event.title,
        description: event.description,
        start: new Date(event.start),
        end: new Date(event.end),
        location: event.location,
        capacity: event.capacity,
        venue: event.venue,
        speakers: event.speakers || [],
      }));

      setEvents(formattedEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      handleError(error.response?.data?.message || "Failed to fetch events");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    const age = parseInt(formData.age);
    if (!formData.age || isNaN(age)) {
      errors.age = "Age is required and must be a number";
    } else if (age < 18 || age > 100) {
      errors.age = "Age must be between 18 and 100";
    }
    if (!formData.qualification.trim()) {
      errors.qualification = "Qualification is required";
    } else if (formData.qualification.trim().length < 2) {
      errors.qualification = "Qualification must be at least 2 characters long";
    }

    if (!formData.workingStatus) {
      errors.workingStatus = "Working status is required";
    } else if (
      !["student", "employed", "unemployed", "self-employed"].includes(
        formData.workingStatus
      )
    ) {
      errors.workingStatus = "Please select a valid working status";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (eventId) => {
    setError(null); 
    if (!validateForm()) {
      handleError("Please fill in all required fields correctly");
      return;
    }
    console.log("Registration started:", { eventId, formData });
    setIsRegistering(true);
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("email");

      if (!token || !userEmail) {
        handleError("Authentication required");
        setIsRegistering(false);
        return;
      }
      // Validate form data
      if (
        !formData.name ||
        !formData.age ||
        !formData.qualification ||
        !formData.workingStatus
      ) {
        handleError("Please fill in all required fields");
        setIsRegistering(false);
        return;
      }

      // Check if event is full before submitting
      const event = events.find((e) => e._id === eventId);
    if (event && event.registeredUsers?.length >= event.capacity) {
      setError("This event is already full");
      setIsRegistering(false);
      return;
    }

    if (isUserRegistered(event)) {
      setError("You are already registered for this event");
      setIsRegistering(false);
      return;
    }

      // Check if we have user email
      if (!userEmail) {
        handleError("User email not found");
        setIsRegistering(false);
        return;
      }
      console.log("Sending registration request...");
      const registrationData = {
        name: formData.name.trim(),
        email: userEmail,
        age: parseInt(formData.age),
        qualification: formData.qualification.trim(),
        workingStatus: formData.workingStatus,
        registrationDate: new Date().toISOString(),
      };
      
      console.log("Sending registration request:", {
        eventId,
        data: registrationData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Registration data:", registrationData);
      const response = await axios.post(
        `http://localhost:8080/api/events/${eventId}/register`,
        registrationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Registration response:", response);
      if (response.status === 200) {
        alert("Successfully registered for event");
        handleSuccess("Successfully registered for event");
        setShowModal(false);
        setFormData({
          name: "",
          age: "",
          qualification: "",
          workingStatus: "",
        });
        setFormErrors({});
        await fetchEvents();
      }
    } catch (error) {
      const errorResponse = error.response?.data;
      console.error("Registration error details:", {
        status: error.response?.status,
        data: errorResponse,
        message: errorResponse?.message || error.message,
      });

      const errorMessage =
        error.response?.data?.message || "Failed to register for event";
      handleError(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  const isEventFull = (event) => {
    return event.registeredUsers?.length >= event.capacity;
  };

  const isUserRegistered = (event) => {
    const userId = localStorage.getItem("userId");
    return event.registeredUsers?.some((reg) => reg.user === userId);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
    setIsRegistering(false);
    setFormData({
      name: "",
      age: "",
      qualification: "",
      workingStatus: "",
    });
  };
  return (
    <>
      <Navbar />
      <div style={{ padding: "460px 100px 60px 100px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Event Schedule
        </h1>
        {loading ? (
          <div style={{ textAlign: "center" }}>Loading events...</div>
        ) : (
          <div style={{ height: 500 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              views={["month", "week", "day"]}
              defaultView="month"
              selectable
              popup
              onSelectEvent={handleSelectEvent}
              eventPropGetter={() => ({
                style: {
                  backgroundColor: "#3174ad",
                  borderRadius: "5px",
                  opacity: 0.8,
                  color: "white",
                },
              })}
            />
          </div>
        )}
        {showModal && selectedEvent && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="event-detail-header">
                <h2>{selectedEvent.title}</h2>
              </div>
              {(isEventFull(selectedEvent) ||
                isUserRegistered(selectedEvent) ||
                error) && (
                <div
                  className={`status-message ${
                    error
                      ? "error"
                      : isEventFull(selectedEvent)
                      ? "warning"
                      : "info"
                  }`}
                >
                  {isEventFull(selectedEvent) &&
                    "This event is already at full capacity."}
                  {isUserRegistered(selectedEvent) &&
                    "You are already registered for this event."}
                  {error && error}
                </div>
              )}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Form submitted");
                  handleRegister(selectedEvent._id);
                }}
                className="registration-form"
              >
                <div className="form-group">
                  <label>Full Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    className={formErrors.name ? "error" : ""}
                    required
                  />
                  {error && <div className="error-message">{error}</div>}
                </div>
                <div className="form-group">
                  <label>Age:</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleFormChange}
                    className={formErrors.age ? "error" : ""}
                    required
                    min="18"
                    max="100"
                  />
                  {formErrors.age && (
                    <div className="error-text">{formErrors.age}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Qualification:</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleFormChange}
                    className={formErrors.qualification ? "error" : ""}
                    required
                  />
                  {formErrors.qualification && (
                    <div className="error-text">{formErrors.qualification}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Working Status:</label>
                  <select
                    name="workingStatus"
                    value={formData.workingStatus}
                    onChange={handleFormChange}
                    className={formErrors.workingStatus ? "error" : ""}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="student">Student</option>
                    <option value="employed">Employed</option>
                    <option value="unemployed">Unemployed</option>
                    <option value="self-employed">Self-Employed</option>
                  </select>
                  {formErrors.workingStatus && (
                    <div className="error-text">{formErrors.workingStatus}</div>
                  )}
                </div>

                <div className="event-details-grid">
                  <div className="top-row">
                    <div className="detail-item">
                      <h4>📅 Date & Time</h4>
                      <p>
                        {moment(selectedEvent.start).format("MMMM DD, YYYY")}
                      </p>
                      <p>
                        {moment(selectedEvent.start).format("HH:mm")} -{" "}
                        {moment(selectedEvent.end).format("HH:mm")}
                      </p>
                    </div>

                    <div className="detail-item">
                      <h4>📍 Location</h4>
                      <p>{selectedEvent.location}</p>
                      <p>
                        <strong>Venue:</strong>{" "}
                        {selectedEvent.venue?.name || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="middle-row">
                    <div className="detail-item">
                      <h4>💡 Description</h4>
                      <p>{selectedEvent.description}</p>
                    </div>
                  </div>

                  <div className="middle-row">
                    <div className="detail-item">
                      <h4>👥 Capacity</h4>
                      <p>{selectedEvent.capacity} attendees</p>
                    </div>
                  </div>
                </div>

                {selectedEvent.speakers?.length > 0 && (
                  <div className="speakers-section">
                    <h3>Featured Speakers</h3>
                    <div className="speakers-grid">
                      {selectedEvent.speakers.map((speaker) => (
                        <div key={speaker._id} className="speaker-card">
                          <img
                            src={speaker.image || defaultSpeaker}
                            alt={speaker.name}
                            className="speaker-photo"
                          />
                          <h4>{speaker.name}</h4>
                          <p>{speaker.topic}</p>
                          <small>{speaker.bio}</small>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="button-group">
                  {/* <button type="submit" className="register-button">
                    Register
                  </button> */}
                  <button
                    type="submit"
                    className="register-button"
                    disabled={
                      isRegistering ||
                      isEventFull(selectedEvent) ||
                      isUserRegistered(selectedEvent)
                    }
                  >
                    {/* {isRegistering ? "Registering..." : "Register"} */}
                    {isRegistering
                      ? "Registering..."
                      : isEventFull(selectedEvent)
                      ? "Event Full"
                      : isUserRegistered(selectedEvent)
                      ? "Already Registered"
                      : "Register"}
                  </button>
                  <button
                    type="button"
                    className="close-button"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default UserSchedular;
