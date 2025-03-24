import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Venues.css";
function Venues() {
  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/AdminDashboard");
  };
  return (
    <div className="venues-container">
      <div className="venues-card">
        <h1 className="venues-title">Admin Dashboard</h1>
        <p className="venues-description">Manage events and venues here.</p>
        <div className="button-group">
          <Link to="/admin/add-venues">
            <button className="add-venues-button">Add Venue</button>
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

export default Venues;
