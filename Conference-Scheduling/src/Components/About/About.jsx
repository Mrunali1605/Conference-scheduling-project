import React from "react";
import "./About.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import collaborationImage from "../../assets/collaboration.png";
import speaker1 from "../../assets/speaker1.jpg";
import speaker2 from "../../assets/speaker2.jpg";
import { FaLightbulb, FaHandshake, FaChartLine, FaHeart } from "react-icons/fa";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <section className="hero-section">
          <h1>About TechConf</h1>
          <p>Empowering Events Through Technology</p>
          <p>Your trusted partner in professional event management</p>
        </section>

        <section className="mission-section">
          <div className="mission-content">
            <div>
              <h2>Our Mission</h2>
              <p>
                To revolutionize conference planning by providing cutting-edge
                scheduling solutions that bring people together and create
                memorable experiences through seamless organization and
                management.
              </p>
            </div>
            <img
              src={collaborationImage}
              alt="Team collaboration"
              className="mission-image"
            />
          </div>
        </section>

        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <FaLightbulb className="value-icon" />
              <h3>Innovation</h3>
              <p>Constantly evolving and improving our platform</p>
            </div>
            <div className="value-card">
              <FaHandshake className="value-icon" />
              <h3>Reliability</h3>
              <p>Building trust through consistent performance</p>
            </div>
            <div className="value-card">
              <FaChartLine className="value-icon" />
              <h3>Excellence</h3>
              <p>Striving for the highest quality in everything we do</p>
            </div>
            <div className="value-card">
              <FaHeart className="value-icon" />
              <h3>User-Focused</h3>
              <p>Putting our users' needs first</p>
            </div>
          </div>
        </section>

        <section className="journey-section">
          <h2>Our Journey</h2>
          <div className="timeline">
            <div className="timeline-item">
              <p>Founded with a vision to transform conference management</p>
            </div>
            <div className="timeline-item">
              <p>Launched our first comprehensive platform</p>
            </div>
            <div className="timeline-item">
              <p>Expanded to serve international clients</p>
            </div>
            <div className="timeline-item">
              <p>Revolutionizing the industry with AI-powered solutions</p>
            </div>
          </div>
        </section>
        <section className="achievements-section">
          <h2>Our Achievements</h2>
          <table className="achievements-table">
            <thead>
              <tr>
                <th>Achievement</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Best Event Management Platform</td>
                <td>Manages Conferences effectively</td>
              </tr>
              <tr>
                <td>Innovation </td>
                <td>Easy to access and use</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default About;
