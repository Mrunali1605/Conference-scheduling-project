import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./AdminDashboard.css";
import { handleError, handleSuccess } from "../../Utile";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [availableSpeakers, setAvailableSpeakers] = useState([]);
  const [availableVenues, setAvailableVenues] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start: "",
    end: "",
    venue: "",
    location: "",
    capacity: "",
    speakers: [],
  });

  // Fetch all events
  const fetchEvents = async () => {
    // try {
    //   const response = await axios.get("http://localhost:8080/api/events");
    //   const formattedEvents = response.data.map((event) => ({
    //     ...event,
    //     start: new Date(event.start),
    //     end: new Date(event.end),
    //   }));
    //   setEvents(formattedEvents);
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
      const [eventsRes, speakersRes, venuesRes] = await Promise.all([
        axios.get("http://localhost:8080/api/events", { headers }),
        axios.get("http://localhost:8080/api/speakers", { headers }),
        axios.get("http://localhost:8080/api/venues", { headers }),
      ]);

      //   setEvents(
      //     eventsRes.data.map((event) => ({
      //       ...event,
      //       start: new Date(event.start),
      //       end: new Date(event.end),
      //       description: event.description,
      // location: event.location,
      // capacity: event.capacity,
      // venue: event.venue,
      // speakers: event.speakers,
      //     }))
      //   );
      const formattedEvents = eventsRes.data.map((event) => ({
        _id: event._id,
        title: event.title,
        description: event.description,
        start: new Date(event.start),
        end: new Date(event.end),
        location: event.location,
        capacity: event.capacity,
        venue: event.venue || null,
        speakers: event.speakers || [],
        createdBy: event.createdBy,
      }));
      console.log("Formatted events:", formattedEvents);
      setEvents(formattedEvents);

      setAvailableSpeakers(speakersRes.data);
      setAvailableVenues(venuesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        handleError("Session expired. Please login again.");
      } else {
        handleError(error.response?.data?.message || "Failed to fetch data");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      handleError("Authentication required");
      return;
    }
    fetchEvents();
  }, []);

  // Handle form submission for create and update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleError("Authentication required. Please log in.");
        return;
      }
      console.log("Sending event data:", newEvent);
      // Validate form data
      if (
        !newEvent.title ||
        !newEvent.description ||
        !newEvent.start ||
        !newEvent.end ||
        !newEvent.location ||
        !newEvent.capacity
      ) {
        handleError("All fields are required");
        return;
      }

      // Validate dates
      const startDate = new Date(newEvent.start);
      const endDate = new Date(newEvent.end);
      if (startDate >= endDate) {
        handleError("End time must be after start time");
        return;
      }

      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        start: new Date(newEvent.start).toISOString(),
        end: new Date(newEvent.end).toISOString(),
        location: newEvent.location,
        capacity: parseInt(newEvent.capacity),
        speakers: newEvent.speakers,
        venue: newEvent.venue || null,
        // venue: newEvent.venue,
      };
      console.log("Sending event data:", eventData);
      let response;
      if (modalMode === "edit" && selectedEvent?._id) {
        // Update existing event
        response = await axios.put(
          `http://localhost:8080/api/events/${selectedEvent._id}`,
          eventData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        handleSuccess("Event updated successfully");
      } else {
        // Create new event
        response = await axios.post(
          "http://localhost:8080/api/events",
          eventData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        handleSuccess("Event created successfully");
      }

      if (response.status === 200 || response.status === 201) {
        await fetchEvents(); // Refresh events from database
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      handleError(error.response?.data?.message || "Error processing event");
    }
  };
  const handleVenueChange = (e) => {
    const venueId = e.target.value;
    setNewEvent((prev) => ({
      ...prev,
      venue: venueId || null, // Consistently set to null if empty
    }));
  };
  // Handle event deletion
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedEvent) return;

      await axios.delete(
        `http://localhost:8080/api/events/${selectedEvent._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      handleSuccess("Event deleted successfully");
      fetchEvents();
      setShowModal(false);
      resetForm();
    } catch (error) {
      handleError(error.response?.data?.message || "Error deleting event");
    }
  };

  // Handle event selection from calendar
  const handleSelectEvent = (event) => {
    if (!event) return;
    console.log("Selected event:", event);
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      start: moment(event.start).format("YYYY-MM-DDTHH:mm"),
      end: moment(event.end).format("YYYY-MM-DDTHH:mm"),
      location: event.location,
      capacity: event.capacity,
      // speakers: event.speakers || [],
      speakers: Array.isArray(event.speakers)
        ? event.speakers.map((speaker) => speaker._id).filter(Boolean)
        : [],
      venue: event.venue?._id,
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const resetForm = () => {
    setNewEvent({
      title: "",
      description: "",
      start: "",
      end: "",
      location: "",
      capacity: "",
      speakers: [],
      venue: "",
    });
    setSelectedEvent(null);
    setModalMode("create");
  };

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-header">
        <h1>Admin Dashboard</h1>
        <button
          className="add-event-button"
          onClick={() => {
            setModalMode("create");
            resetForm();
            setShowModal(true);
          }}
        >
          Add New Event
        </button>
      </div>
      <div className="admin-dashboard">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={["month", "week", "day"]}
          defaultView="month"
          selectable
          popup
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: "#3174ad",
              borderRadius: "5px",
              opacity: 0.8,
              color: "white",
            },
          })}
        />

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>
                {modalMode === "create" ? "Create New Event" : "Edit Event"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Event Title:</label>
                  <input
                    type="text"
                    id="title"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    required
                    placeholder="Enter event title"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, description: e.target.value })
                    }
                    required
                    placeholder="Enter event description"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="start">Start Date & Time:</label>
                  <input
                    type="datetime-local"
                    id="start"
                    value={newEvent.start}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, start: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="end">End Date & Time:</label>
                  <input
                    type="datetime-local"
                    id="end"
                    value={newEvent.end}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, end: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location:</label>
                  <input
                    type="text"
                    id="location"
                    value={newEvent.location}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, location: e.target.value })
                    }
                    required
                    placeholder="Enter location"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="capacity">Capacity:</label>
                  <input
                    type="number"
                    id="capacity"
                    value={newEvent.capacity}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, capacity: e.target.value })
                    }
                    required
                    placeholder="Enter capacity"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="speakers">Speakers:</label>
                  <select
                    multiple
                    id="speakers"
                    value={newEvent.speakers}
                    onChange={(e) => {
                      const selectedSpeakers = Array.from(
                        e.target.selectedOptions,
                        (option) => option.value
                      );
                      setNewEvent({ ...newEvent, speakers: selectedSpeakers });
                    }}
                    className="multiple-select"
                  >
                    {availableSpeakers.map((speaker) => (
                      <option key={speaker._id} value={speaker._id}>
                        {speaker.name} - {speaker.topic}
                      </option>
                    ))}
                  </select>
                  <small className="help-text">
                    Hold Ctrl (Windows) to select multiple speakers
                  </small>
                </div>
                <div className="form-group">
                  <label htmlFor="venue">Venue:</label>
                  <select
                    id="venue"
                    name="venue"
                    value={newEvent.venue|| ""}
                    // onChange={handleVenueChange}
                    onChange={(e) => {
                        const venueId = e.target.value;
                        console.log("Selected venue ID:", venueId);
                        setNewEvent({ ...newEvent, venue: venueId || null 
              
                        });
                      }}
                  >
                    <option value="">Select Venue</option>
                    {availableVenues.map((venue) => (
                      <option key={venue._id} value={venue._id}>
                        {venue.name} - Capacity: {venue.capacity}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="button-group">
                  <button type="submit">
                    {modalMode === "create" ? "Create Event" : "Update Event"}
                  </button>
                  {modalMode === "edit" && (
                    <button type="button" onClick={handleDelete}>
                      Delete Event
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <br></br>
      <br></br>
      <Footer />
    </>
  );
}

export default AdminDashboard;
