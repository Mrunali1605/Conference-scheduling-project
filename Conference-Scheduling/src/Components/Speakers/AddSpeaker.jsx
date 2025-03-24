import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { requireAdmin } from "../../Utile";
import axios from "axios";
import "./AddSpeaker.css";

function AddSpeaker() {
  const [formData, setFormData] = useState({
    name: "",
    topic: "",
    bio: "",
    image: "",
    eventId: "",
  });

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      const userRole = localStorage.getItem("userRole");

      console.log("Current token:", token);
      console.log("Current userRole:", userRole);
      if (!token || userRole !== "admin") {
        navigate("/unauthorized");
        return;
      }
    };

    checkAdmin();
    fetchEvents();
  }, [navigate]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/events", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      if (error.response?.status === 403) {
        navigate("/unauthorized");
      } else {
        setError("Failed to load events. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      console.log("Making request with data:", {
        url: "http://localhost:8080/api/admin/speakers/add",
        formData,
        token: token ? "Token present" : "No token",
      });
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      if (
        !formData.name ||
        !formData.topic ||
        !formData.bio ||
        !formData.eventId
      ) {
        setError("All fields are required except image");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/api/speakers/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        alert("Speaker added successfully!");
        navigate("/speakers");
      }
    } catch (error) {
      console.error("Error details:", error.response);
      if (error.response?.status === 404) {
        setError(
          "API endpoint not found. Please check the server configuration."
        );
      } else if (error.response?.status === 403) {
        navigate("/unauthorized");
      } else {
        setError(error.response?.data?.message || "Failed to add speaker");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/AdminDashboard");
  };

  return (
    <div className="add-speaker-container">
      <h2>Add Speaker</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="event">Event:</label>
          <select
            name="eventId"
            value={formData.eventId}
            onChange={handleChange}
            required
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title} - {new Date(event.start).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <label htmlFor="speaker">Speaker Name:</label>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Speaker Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <label htmlFor="topic">Topic:</label>
        <div className="form-group">
          <input
            type="text"
            name="topic"
            placeholder="Topic"
            value={formData.topic}
            onChange={handleChange}
            required
          />
        </div>

        <label htmlFor="speaker bio">Speaker Bio:</label>
        <div className="form-group">
          <textarea
            name="bio"
            placeholder="Speaker Bio"
            value={formData.bio}
            onChange={handleChange}
            required
          />
        </div>
        <label htmlFor="speakerImg">Speaker photo:</label>
        <div className="form-group">
          <input
            type="text"
            name="image"
            placeholder="Image URL (optional)"
            value={formData.image}
            onChange={handleChange}
          />
        </div>

        {/* <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Speaker"}
        </button> */}
        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Speaker"}
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
    </div>
  );
}

export default AddSpeaker;
