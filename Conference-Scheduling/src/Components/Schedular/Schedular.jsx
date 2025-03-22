import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Schedular.css";

const localizer = momentLocalizer(moment);

function Scheduler() {
  const [events, setEvents] = useState([
    {
      title: "Meeting",
      start: new Date(2025, 0, 25, 10, 0),
      end: new Date(2025, 0, 25, 12, 0),
    },
    {
      title: "Conference",
      start: new Date(2025, 0, 26, 14, 0),
      end: new Date(2025, 0, 26, 16, 0),
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
  });

  const handleAddEvent = () => {
    setEvents([...events, newEvent]);
    setNewEvent({ title: "", start: "", end: "" });
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Any side-effects can be handled here
  }, [events]);

  return (
    <div className="scheduler-container">
      <h1>Event Scheduler</h1>
      <button className="add-event-button" onClick={() => setShowModal(true)}>
        Add Event
      </button>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
      {showModal && (
        <div className="event-modal-overlay">
          <div className="event-form">
            <h2>Create New Event</h2>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={handleChange}
            />
            <input
              type="datetime-local"
              name="start"
              value={newEvent.start}
              onChange={handleChange}
            />
            <input
              type="datetime-local"
              name="end"
              value={newEvent.end}
              onChange={handleChange}
            />
            <div>
              <button className="event-button" onClick={handleAddEvent}>
                Add Event
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Scheduler;
