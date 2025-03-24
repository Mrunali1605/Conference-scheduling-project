// import React, { useState, useEffect } from "react";
// import { Calendar, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
// import axios from "axios";
// import "react-big-calendar/lib/css/react-big-calendar.css";
// import { handleError } from "../../Utile";

// const localizer = momentLocalizer(moment);

// function UserSchedular() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   // Fetch all events
//   const fetchEvents = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         handleError("Authentication required");
//         return;
//       }

//       const headers = {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       };

//       const response = await axios.get("http://localhost:8080/api/events", {
//         headers,
//       });

//       const formattedEvents = response.data.map((event) => ({
//         _id: event._id,
//         title: event.title,
//         description: event.description,
//         start: new Date(event.start),
//         end: new Date(event.end),
//         location: event.location,
//         capacity: event.capacity,
//         venue: event.venue,
//         speakers: event.speakers || [],
//       }));

//       setEvents(formattedEvents);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       handleError(error.response?.data?.message || "Failed to fetch events");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   // Handle event selection from calendar
//   const handleSelectEvent = (event) => {
//     setSelectedEvent(event);
//     setShowModal(true);
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ padding: "460px 100px 60px 100px" }}>
//         <h1 style={{ textAlign: "center", marginBottom: "50px" }}>
//           Event Schedule
//         </h1>
//         {loading ? (
//           <div style={{ textAlign: "center" }}>Loading events...</div>
//         ) : (
//           <div style={{ height: 500 }}>
//             <Calendar
//               localizer={localizer}
//               events={events}
//               startAccessor="start"
//               endAccessor="end"
//               views={["month", "week", "day"]}
//               defaultView="month"
//               selectable
//               popup
//               onSelectEvent={handleSelectEvent}
//               eventPropGetter={() => ({
//                 style: {
//                   backgroundColor: "#3174ad",
//                   borderRadius: "5px",
//                   opacity: 0.8,
//                   color: "white",
//                 },
//               })}
//             />
//           </div>
//         )}

//         {/* Event Details Modal */}
//         {showModal && selectedEvent && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               <h3>{selectedEvent.title}</h3>
//               <p>
//                 <strong>Description:</strong> {selectedEvent.description}
//               </p>
//               <p>
//                 <strong>Location:</strong> {selectedEvent.location}
//               </p>
//               <p>
//                 <strong>Venue:</strong>{" "}
//                 {selectedEvent.venue?.name || "Not specified"}
//               </p>
//               <p>
//                 <strong>Capacity:</strong> {selectedEvent.capacity}
//               </p>
//               <p>
//                 <strong>Date:</strong>{" "}
//                 {moment(selectedEvent.start).format("MMMM DD, YYYY")}
//               </p>
//               <p>
//                 <strong>Time:</strong>{" "}
//                 {moment(selectedEvent.start).format("HH:mm")} -{" "}
//                 {moment(selectedEvent.end).format("HH:mm")}
//               </p>

//               {selectedEvent.speakers.length > 0 && (
//                 <div>
//                   <strong>Speakers:</strong>
//                   <ul>
//                     {selectedEvent.speakers.map((speaker) => (
//                       <li key={speaker._id}>
//                         {speaker.name} - {speaker.topic}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               <button onClick={() => setShowModal(false)}>Close</button>
//             </div>
//           </div>
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// }

// export default UserSchedular;

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

  const handleRegister = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleError("Authentication required");
        return;
      }

      const response = await axios.post(
        `http://localhost:8080/api/events/${eventId}/register`,
        {}, // Empty body since we don't need additional data
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        handleSuccess(response.data.message);
        setShowModal(false);
        await fetchEvents(); // Refresh events to update registration status
      }
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to register for event";
      handleError(errorMessage);
    }
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
                <div className="button-group">
                  <button
                    className="register-button"
                    onClick={() => handleRegister(selectedEvent._id)}
                  >
                    Register
                  </button>
                  <button
                    className="close-button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="event-details-grid">
                <div className="top-row">
                  <div className="detail-item">
                    <h4>📅 Date & Time</h4>
                    <p>{moment(selectedEvent.start).format("MMMM DD, YYYY")}</p>
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
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default UserSchedular;
