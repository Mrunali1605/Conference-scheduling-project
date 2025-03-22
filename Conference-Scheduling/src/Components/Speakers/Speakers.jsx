import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Speakers.css"; 

function Speakers() {
  const navigate = useNavigate();

  return (
    <div className="speakers-container">
      <div className="speakers-card">
        <h1 className="speakers-title">Admin Dashboard</h1>
        <p className="speakers-description">
          Manage events and registered users here.
        </p>

        <Link to="/admin/add-speaker">
          <button className="add-speaker-button">Add Speaker</button>
        </Link>
      </div>
    </div>
  );
}

export default Speakers;
