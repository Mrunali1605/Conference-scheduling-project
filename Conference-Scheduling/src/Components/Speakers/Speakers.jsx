import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Speakers.css";

function Speakers() {
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/AdminDashboard");
  };
  return (
    <div className="speakers-container">
      <div className="speakers-card">
        <h1 className="speakers-title">Admin Dashboard</h1>
        <p className="speakers-description">
          Manage events and registered users here.
        </p>
        <div className="button-group">
          <Link to="/admin/add-speaker">
            <button className="add-speaker-button">Add Speaker</button>
          </Link>
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Speakers;
