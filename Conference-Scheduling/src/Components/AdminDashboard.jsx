import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { handleError, handleSuccess } from "../../Utile";
import { ToastContainer } from "react-toastify";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";

function AdminDashboard() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");

    handleSuccess("Logout Successful");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="home-container">
        <div className="hero-section">
          <h1>Welcome, {loggedInUser}!</h1>
          <h2>Welcome to TechConf</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* <div className="event-info">
        <h1>Eventify</h1>
        <p className="tagline">
          <em>‘Simplify’ your Events</em>
        </p>
        <p className="about">
          Explore the magic of our application 'EVENTIFY'. A go-to solution for
          managing amazing events effortlessly. From easy sign-ups to
          registering and managing event schedules, our user-friendly platform
          has everything you need for a flawless experience. With powerful
          features, trust our system to handle the details, and let's bring your
          event vision to life!
        </p>
      </div>
      <img
        src="//www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-bnr-bg.svg"
        alt="Online appointment Scheduling"
        width="640"
        height="470"
        fetchpriority="high"
      ></img> */}

      <Footer />
      <ToastContainer />
    </>
  );
}

export default AdminDashboard;
