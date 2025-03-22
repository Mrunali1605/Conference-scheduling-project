import React, { useState } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          <span>TechConf</span>
        </div>

        <div className="nav-links">
          <ul className="nav-links">
            <li>
              <Link to="/Home">Home</Link>
            </li>
            <li>
              <Link to="/AdminDashboard">Schedule</Link>
            </li>
            <li>
              <Link to="/speakers">Speakers</Link>
            </li>
            <li>
              <Link to="/venues">Venues</Link>
            </li>
            <li>
              <Link to="/RegisterNow">Register Now</Link>
            </li>
          </ul>
        </div>
        <button className="logout-button" onClick={onLogout}>
          Log Out
        </button>
      </nav>
      <Outlet />
    </>
  );
}

export default Navbar;
