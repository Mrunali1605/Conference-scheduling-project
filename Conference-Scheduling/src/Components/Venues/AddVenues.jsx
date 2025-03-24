import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddVenues.css";
import { handleError, handleSuccess } from "../../Utile";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const AddVenues = () => {
  const navigate = useNavigate();
  // const [venue, setVenue] = useState({
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: "",
    facilities: "",
    eventId: "",
  });
  const [selectedEvent, setSelectedEvent] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch available events when component mounts
    //   const checkAdmin = async () => {
    //     const token = localStorage.getItem("token");
    //     const userRole = localStorage.getItem("userRole");

    //     if (!token || userRole !== "admin") {
    //       navigate("/unauthorized");
    //       return;
    //     }
    //   };
    //   checkAdmin();
    //   fetchEvents();
    // }, [navigate]);
    const loadEvents = async () => {
      setIsLoading(true);
      try {
        await fetchEvents();
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axios.get("http://localhost:8080/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(response.data);
      console.log("Events response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setEvents(response.data);
      } else {
        setError("Invalid events data format received");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.response?.data?.message || "Failed to fetch events");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //   setVenue({
  //     ...venue,
  //     [e.target.name]: e.target.value,
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorError("Authentication required");
        setLoading(false);
        return;
      }

      if (
        !formData.name ||
        !formData.address ||
        !formData.capacity ||
        !formData.facilities ||
        !formData.eventId
      ) {
        setError("All fields are required");
        setLoading(false);
        return;
      }
      console.log("Sending venue data:", {
        url: "http://localhost:8080/api/venues",
        formData,
      });

      const response = await axios.post(
        "http://localhost:8080/api/venues",
        // venue,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        handleSuccess("Venue added successfully!");
        navigate("/venues");
      }
      // setVenue({
      //   name: "",
      //   address: "",
      //   capacity: "",
      //   facilities: "",
      //   eventId: "",
      // });
    } catch (error) {
      console.error("Error details:", error.response);
      // handleError(error.response?.data?.message || "Error adding venue");
      if (error.response?.status === 404) {
        setError(
          "API endpoint not found. Please check the server configuration."
        );
      } else if (error.response?.status === 403) {
        navigate("/unauthorized");
      } else {
        setError(error.response?.data?.message || "Failed to add venue");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/AdminDashboard");
  };

  return (
    <div className="add-venue-container">
      <h2>Add New Venue</h2>

      {error && <p className="error-message">{error}</p>}
      {isLoading ? (
        <div>Loading events...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="eventId">Event:</label>
            <select
              id="eventId"
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
              required
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                // <option key={event._id} value={event._id}>
                //   {event.name}
                <option key={event._id} value={event._id}>
                  {event.title} - {new Date(event.start).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name">Venue Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter venue name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter venue address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="capacity">Capacity:</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              min="1"
              placeholder="Enter venue capacity"
            />
          </div>

          <div className="form-group">
            <label htmlFor="facilities">Facilities:</label>
            <input
              type="text"
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              required
              placeholder="e.g., Wi-Fi, Projector, Audio System"
            />
          </div>

          <div className="button-group">
            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Venue"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddVenues;
