// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./RegisterNow.css";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";
// import { handleError } from "../../Utile";

// const RegisterNow = () => {
//   const [venues, setVenues] = useState([]);
//   const [speakers, setSpeakers] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("Authentication required");
//           return;
//         }

//         const headers = { Authorization: `Bearer ${token}` };

//         // Fetch all data in parallel
//         const [venuesRes, speakersRes, eventsRes] = await Promise.all([
//           axios.get("http://localhost:8080/api/venues", { headers }),
//           axios.get("http://localhost:8080/api/speakers", { headers }),
//           axios.get("http://localhost:8080/api/events", { headers }),
//         ]);

//         setVenues(venuesRes.data);
//         setSpeakers(speakersRes.data);
//         setEvents(eventsRes.data);
//       } catch (error) {
//         setError(error.response?.data?.message || "Error fetching data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="loading">Loading...</div>
//       </>
//     );
//   }

//   if (error) {
//     return (
//       <>
//         <Navbar />
//         <div className="error">{error}</div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="register-container">
//         <h2>Event Registration Details</h2>

//         <section className="events-section">
//           <h3>Available Events</h3>
//           // Update the events table to include venue and speakers
// <table>
//   <thead>
//     <tr>
//       <th>Event Name</th>
//       <th>Date & Time</th>
//       <th>Venue</th>
//       <th>Speakers</th>
//       <th>Capacity</th>
//       <th>Status</th>
//       <th>Action</th>
//     </tr>
//   </thead>
//   <tbody>
//     {events.map((event) => (
//       <tr key={event._id}>
//         <td>{event.title}</td>
//         <td>
//           {new Date(event.start).toLocaleDateString()} {new Date(event.start).toLocaleTimeString()}
//         </td>
//         <td>{event.venue?.name}</td>
//         <td>
//           {event.speakers?.map(speaker => speaker.name).join(", ")}
//         </td>
//         <td>{event.capacity}</td>
//         <td>{event.status}</td>
//         <td>
//           <button 
//             onClick={() => handleRegister(event._id)}
//             disabled={event.registeredUsers?.length >= event.capacity}
//           >
//             {event.registeredUsers?.length >= event.capacity ? 'Full' : 'Register'}
//           </button>
//         </td>
//       </tr>
//     ))}
//   </tbody>
// </table>
//         </section>

//         <section className="speakers-section">
//           <h3>Featured Speakers</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Topic</th>
//                 <th>Bio</th>
//                 <th>Event</th>
//               </tr>
//             </thead>
//             <tbody>
//               {speakers.map((speaker) => (
//                 <tr key={speaker._id}>
//                   <td>{speaker.name}</td>
//                   <td>{speaker.topic}</td>
//                   <td>{speaker.bio}</td>
//                   <td>{speaker.eventId?.title || "N/A"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         <section className="venues-section">
//           <h3>Available Venues</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Venue Name</th>
//                 <th>Address</th>
//                 <th>Capacity</th>
//                 <th>Facilities</th>
//                 <th>Event</th>
//               </tr>
//             </thead>
//             <tbody>
//               {venues.map((venue) => (
//                 <tr key={venue._id}>
//                   <td>{venue.name}</td>
//                   <td>{venue.address}</td>
//                   <td>{venue.capacity}</td>
//                   <td>{venue.facilities}</td>
//                   <td>{venue.eventId?.title || "N/A"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default RegisterNow;


import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import moment from "moment";
import { handleError, handleSuccess } from "../../Utile";
import "./RegisterNow.css";

const RegisterNow = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch events data
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/events", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching events");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle delete event
  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleError("Authentication required");
        return;
      }

      const confirmed = window.confirm("Are you sure you want to delete this event?");
      if (!confirmed) return;

      await axios.delete(`http://localhost:8080/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      handleSuccess("Event deleted successfully");
      fetchEvents(); // Refresh the data
    } catch (error) {
      handleError(error.response?.data?.message || "Error deleting event");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar />
      <div style={{ padding: "80px 20px 20px 20px" }}>
        <h2>Event Management</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Date & Time</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Capacity</th>
                <th style={styles.th}>Venue</th>
                <th style={styles.th}>Speakers</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td style={styles.td}>{event.title}</td>
                  <td style={styles.td}>{event.description}</td>
                  <td style={styles.td}>
                    Start: {moment(event.start).format("YYYY-MM-DD HH:mm")}
                    <br />
                    End: {moment(event.end).format("YYYY-MM-DD HH:mm")}
                  </td>
                  <td style={styles.td}>{event.location}</td>
                  <td style={styles.td}>{event.capacity}</td>
                  <td style={styles.td}>{event.venue?.name || "N/A"}</td>
                  <td style={styles.td}>
                    {event.speakers?.map(speaker => speaker.name).join(", ") || "No speakers"}
                  </td>
                  <td style={styles.td}>
                    <button 
                      style={styles.deleteButton}
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  },
  th: {
    backgroundColor: "#f4f4f4",
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    fontWeight: "bold"
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    verticalAlign: "top"
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer"
  }
};

export default RegisterNow;