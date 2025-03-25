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
  const [expandedEvent, setExpandedEvent] = useState(null);

  const toggleRegisteredUsers = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await axios.get("http://localhost:8080/api/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched events:", response.data);
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

  const handleDelete = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        handleError("Authentication required");
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to delete this event?"
      );
      if (!confirmed) return;

      await axios.delete(`http://localhost:8080/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      handleSuccess("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      handleError(error.response?.data?.message || "Error deleting event");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <Navbar />
      {/* <h2 style={{ textAlign: "center", fontSize: "50px", paddingTop: "70px" }}>
        Event Management
      </h2> */}
      <div style={{ padding: "300px 20px 20px 20px" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>Description</th>
                <th style={styles.th}>Date & Time</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Registered/Capacity</th>
                <th style={styles.th}>Venue</th>
                <th style={styles.th}>Speakers</th>
                <th style={styles.th}>Details</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <React.Fragment key={event._id}>
                  <tr>
                    <td style={styles.td}>{event.title}</td>
                    <td style={styles.td}>{event.description}</td>
                    <td style={styles.td}>
                      Start: {moment(event.start).format("YYYY-MM-DD HH:mm")}
                      <br />
                      End: {moment(event.end).format("YYYY-MM-DD HH:mm")}
                    </td>
                    <td style={styles.td}>{event.location}</td>
                    <td style={styles.td}>
                      {event.registeredUsers?.length || 0} / {event.capacity}
                    </td>
                    <td style={styles.td}>{event.venue?.name || "N/A"}</td>
                    <td style={styles.td}>
                      {event.speakers
                        ?.map((speaker) => speaker.name)
                        .join(", ") || "No speakers"}
                    </td>
                    <td style={styles.td}>
                      <button
                        style={styles.detailsButton}
                        onClick={() => toggleRegisteredUsers(event._id)}
                      >
                        {expandedEvent === event._id
                          ? "Hide Details"
                          : "Show Details"}
                        {event.registeredUsers?.length > 0 &&
                          ` (${event.registeredUsers.length})`}
                      </button>
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
                  {expandedEvent === event._id && (
                    <tr>
                      <td colSpan="9" style={styles.registeredUsersCell}>
                        <div style={styles.registeredUsersContainer}>
                          <h4 style={{ margin: "10px 0", padding: "0 15px" }}>
                            Registered Users for {event.title}
                          </h4>
                          {event.registeredUsers?.length > 0 ? (
                            <table style={styles.innerTable}>
                              <thead>
                                <tr>
                                  <th style={styles.innerTableHeader}>Name</th>
                                  <th style={styles.innerTableHeader}>Email</th>
                                  <th style={styles.innerTableHeader}>Age</th>
                                  <th style={styles.innerTableHeader}>
                                    Qualification
                                  </th>
                                  <th style={styles.innerTableHeader}>
                                    Working Status
                                  </th>
                                  <th style={styles.innerTableHeader}>
                                    Registration Date
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {event.registeredUsers.map((registration) => (
                                  <tr key={registration._id}>
                                    <td style={styles.innerTableCell}>
                                      {registration.name}
                                    </td>
                                    <td style={styles.innerTableCell}>
                                      {registration.email}
                                    </td>
                                    <td style={styles.innerTableCell}>
                                      {registration.age}
                                    </td>
                                    <td style={styles.innerTableCell}>
                                      {registration.qualification}
                                    </td>
                                    <td style={styles.innerTableCell}>
                                      {registration.workingStatus}
                                    </td>
                                    <td style={styles.innerTableCell}>
                                      {moment(
                                        registration.registrationDate
                                      ).format("YYYY-MM-DD HH:mm")}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div style={styles.noRegistrations}>
                              No users have registered for this event yet.
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
    fontWeight: "bold",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    verticalAlign: "top",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#c82333",
    },
  },
  detailsButton: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
  registeredUsersCell: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    transition: "all 0.3s ease",
  },
  registeredUsersContainer: {
    maxWidth: "100%",
    overflowX: "auto",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderRadius: "8px",
  },
  innerTable: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
  },
  innerTableHeader: {
    backgroundColor: "#e9ecef",
    color: "#495057",
    padding: "12px 15px",
    textAlign: "left",
    fontWeight: "600",
    borderBottom: "2px solid #dee2e6",
  },
  innerTableCell: {
    padding: "12px 15px",
    borderBottom: "1px solid #dee2e6",
    color: "#212529",
  },
  noRegistrations: {
    padding: "20px",
    textAlign: "center",
    color: "#6c757d",
    fontStyle: "italic",
  },
};

export default RegisterNow;
