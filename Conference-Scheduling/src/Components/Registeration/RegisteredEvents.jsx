import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { handleError } from "../../Utile";
import "./RegisteredEvents.css";

const RegisteredEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        handleError("Authentication required");
        return;
      }

      const response = await axios.get(
        // `http://localhost:8080/api/user/registrations`,
        "http://localhost:8080/api/events/user/registrations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        setRegistrations(response.data);
      }
    } catch (error) {
      handleError(
        error.response?.data?.message || "Failed to fetch registrations"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateTicketNumber = (registration) => {
    return `TKT-${registration.event._id.slice(0, 6)}-${registration._id.slice(
      -6
    )}`;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="registered-events-container">
        <h2>My Registered Events</h2>
        {loading ? (
          <div className="loading">Loading...</div>
        ) : registrations.length === 0 ? (
          <div className="no-events">No registered events found</div>
        ) : (
          <div className="tickets-container">
            {registrations.map((registration) => (
              <div key={registration._id} className="ticket">
                <div className="ticket-header">
                  <h3>{registration.event.title}</h3>
                  <span className="ticket-number">
                    {generateTicketNumber(registration)}
                  </span>
                </div>
                <div className="ticket-details">
                  <p>
                    <strong>Attendee:</strong> {registration.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {registration.email}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(registration.event.start).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(registration.event.start).toLocaleTimeString()}
                  </p>
                  <p>
                    <strong>Venue:</strong>{" "}
                    {registration.event.venue?.name || "TBD"}
                  </p>
                  <p>
                    <strong>Age:</strong> {registration.age}
                  </p>
                  <p>
                    <strong>Qualification:</strong> {registration.qualification}
                  </p>
                  <p>
                    <strong>Working Status:</strong>{" "}
                    {registration.workingStatus}
                  </p>
                </div>
                <div className="ticket-footer">
                  <p className="registration-date">
                    Registered on:{" "}
                    {new Date(
                      registration.registrationDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default RegisteredEvents;
