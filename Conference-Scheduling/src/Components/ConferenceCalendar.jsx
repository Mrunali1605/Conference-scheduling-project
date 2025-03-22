import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";

const ConferenceCalendar = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const res = await axios.get("/api/conferences");
        const formattedEvents = res.data.map((conf) => ({
          title: conf.title,
          start: conf.startDate,
          end: conf.endDate,
          extendedProps: {
            description: conf.description,
            location: conf.location,
          },
        }));
        setEvents(formattedEvents);
      } catch (err) {
        console.error(err);
      }
    };
    fetchConferences();
  }, []);

  return (
    <div>
      <h2>Conference Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={(info) => {
          alert(`
            Conference: ${info.event.title}
            Location: ${info.event.extendedProps.location}
            Description: ${info.event.extendedProps.description}
          `);
        }}
      />
    </div>
  );
};

export default ConferenceCalendar;
