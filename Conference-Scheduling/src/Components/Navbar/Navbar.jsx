// import React, { useState } from "react";
// import { Link, useNavigate, Outlet } from "react-router-dom";
// import "./Navbar.css";

// function Navbar() {
//   const navigate = useNavigate();

//   const onLogout = () => {
//     localStorage.clear();
//     navigate("/");
//   };

//   return (
//     <>
//       <nav className="navbar">
//         <div className="nav-brand">
//           <span>TechConf</span>
//         </div>

//         <div className="nav-links">
//           <ul className="nav-links">
//             <li>
//               <Link to="/Home">Home</Link>
//             </li>
//             <li>
//               <Link to="/AdminDashboard">Schedule</Link>
//             </li>
//             <li>
//               <Link to="/speakers">Speakers</Link>
//             </li>
//             <li>
//               <Link to="/venues">Venues</Link>
//             </li>
//             <li>
//               <Link to="/RegisterNow">Event details</Link>
//             </li>
//           </ul>
//         </div>
//         <button className="logout-button" onClick={onLogout}>
//           Log Out
//         </button>
//       </nav>
//       <Outlet />
//     </>
//   );
// }

// export default Navbar;

import React from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem("userRole") === "admin";

  const onLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const AdminNavLinks = () => (
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
        <Link to="/RegisterNow">Event details</Link>
      </li>
    </ul>
  );

  const UserNavLinks = () => (
    <ul className="nav-links">
      <li>
        <Link to="/Home">Home</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/UserSchedular">Schedules</Link>
      </li>
      {/* <li>
        <Link to="/events">Events</Link>
      </li> */}
      <li>
        <Link to="/register-now">Register Now</Link>
      </li>
      <li>
        <Link to="/Registered-Events">Registered events</Link>
      </li>
    </ul>
  );

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          <span>TechConf</span>
        </div>

        <div className="nav-links">
          {isAdmin ? <AdminNavLinks /> : <UserNavLinks />}
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
