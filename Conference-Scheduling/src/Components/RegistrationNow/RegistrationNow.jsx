import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import RegistrationModal from "./RegistrationModal";
import { handleError, handleSuccess } from "../../Utile";
import moment from "moment";
import "./RegistrationNow.css";

const RegistrationNow = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleError("Authentication required");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      handleError(error.response?.data?.message || "Failed to fetch events");
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleError("Authentication required");
        return;
      }

      // Get form data from modal
      const registrationData = {
        name: formData.name,
        age: parseInt(formData.age),
        qualification: formData.qualification,
        workingStatus: formData.workingStatus,
      };

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

      if (response.status === 200) {
        handleSuccess("Successfully registered for event");
        setShowModal(false);
        await fetchEvents(); // Refresh events list
      }
    } catch (error) {
      handleError(error.response?.data?.message || "Registration failed");
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="register-container">
        <h2>Available Events</h2>
        <div className="events-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <h3>{event.title}</h3>
              <div className="event-details">
                <p>
                  <strong>Date:</strong>{" "}
                  {moment(event.start).format("MMMM DD, YYYY")}
                </p>
                <p>
                  <strong>Time:</strong> {moment(event.start).format("HH:mm")}
                </p>
                <p>
                  <strong>Venue:</strong> {event.venue?.name || "TBD"}
                </p>
                <p>
                  <strong>Available Seats:</strong>{" "}
                  {event.capacity - (event.registeredUsers?.length || 0)}
                </p>
              </div>
              <button
                onClick={() => handleRegister(event)}
                disabled={event.registeredUsers?.length >= event.capacity}
              >
                {event.registeredUsers?.length >= event.capacity
                  ? "Event Full"
                  : "Register"}
              </button>
            </div>
          ))}
        </div>

        {showRegistrationModal && selectedEvent && (
          <RegistrationModal
            event={selectedEvent}
            onClose={() => setShowRegistrationModal(false)}
            onSubmit={handleRegistrationSubmit}
          />
        )}
      </div>
      <Footer />
    </>
  );
};

export default RegistrationNow;
