import React from "react";
import { useNavigate } from "react-router-dom";
import "./Unauthorized.css";

function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <h1>Access Denied</h1>
      <p>Sorry, you don't have permission to access this page.</p>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
}

export default Unauthorized;
