import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleError, handleSuccess } from "../../Utile";
import { ToastContainer } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "../Home/Home.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function adminHome() {
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
          <h1>Welcome, {loggedInUser}!</h1>
          <h2>Welcome to TechConf</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
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
            for managing amazing events effortlessly. From easy sign-ups to
            registering and managing event schedules, our user-friendly platform
            has everything you need for a flawless experience. With powerful
            features, trust our system to handle the details, and let's bring
            your event vision to life!
          </p>
        </div>
      </div>
      
      <Slider />
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
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
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

export default adminHome;
