import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../Utile";
import { ToastContainer } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "../Home/Home.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaCalendar, FaUsers, FaMapMarkerAlt, FaClock } from "react-icons/fa";

function Home() {
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
      <Navbar />
      <div className="home-container">
        <div className="hero-section">
          <h1>Welcome to TechConf</h1>
          <h2>Your Premier Conference Management Platform</h2>
          <p className="hero-subtitle">Where Technology Meets Organization</p>
        </div>

        <div className="event-container">
          <img
            src="//www.zohowebstatic.com/sites/zweb/images/bookings/home/zbs-bnr-bg.svg"
            alt="Online appointment Scheduling"
            width="640"
            height="470"
            fetchpriority="high"
          />
          <div className="event-info">
            <h1>TechConf</h1>
            <p className="tagline">
              <em>‘Simplify’ your Events</em>
            </p>
            <p className="about">
              Explore the magic of our application 'TechConf'. A go-to solution
              for managing amazing conference events effortlessly. From easy
              sign-ups to registering and managing conference event schedules,
              our user-friendly platform has everything you need for a flawless
              experience. With powerful features, trust our system to handle the
              details, and let's bring your event vision to life!
            </p>
          </div>
        </div>
      </div>
      <Slider />

      <div className="features-section">
        <h2>Why Choose TechConf?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaCalendar className="feature-icon" />
            <h3>Smart Scheduling</h3>
            <p>Effortlessly manage and coordinate multiple conference events</p>
          </div>
          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h3>Easy Registration</h3>
            <p>Streamlined registration process for attendees and speakers</p>
          </div>
          <div className="feature-card">
            <FaMapMarkerAlt className="feature-icon" />
            <h3>Venue Management</h3>
            <p>Organize and track venue availability and capacity</p>
          </div>
          <div className="feature-card">
            <FaClock className="feature-icon" />
            <h3>Real-time Updates</h3>
            <p>Stay informed with instant notifications and schedule changes</p>
          </div>
        </div>
      </div>

      <div className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>
              "TechConf has revolutionized how we manage our tech conferences."
            </p>
            <h4>- John Doe, Tech Lead</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "The most user-friendly conference management system I've ever
              used."
            </p>
            <h4>- Jane Smith, Event Manager</h4>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat-item">
          <h3>1000+</h3>
          <p>Events Managed</p>
        </div>
        <div className="stat-item">
          <h3>50k+</h3>
          <p>Happy Users</p>
        </div>
        <div className="stat-item">
          <h3>200+</h3>
          <p>Venues</p>
        </div>
      </div>
      <br></br>
      <br></br>
      <Footer />
      <ToastContainer />
    </>
  );
}

const images = [
  "./assets/image2.jpg",
  "./assets/image1.jpeg",
  "./assets/image3.png",
  "./assets/image4.jpg",
  "./assets/image5.jpg",
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider-container">
      <div className="slider">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="slide-image"
        />
      </div>
    </div>
  );
};

export default Home;
