import React from "react";
import "./About.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import collaborationImage from "../../assets/collaboration.png";
import speaker1 from "../../assets/speaker1.jpg";
import speaker2 from "../../assets/speaker2.jpg";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <section className="hero-section">
          <h1>TechConf</h1>
          <p>Your trusted partner in professional event management</p>
        </section>

        <section className="mission-section">
          <div className="mission-content">
            <div>
              <h2>Our Mission</h2>
              <p>
                To revolutionize conference planning by providing cutting-edge
                scheduling solutions that bring people together.
              </p>
            </div>
            <img
              src={collaborationImage}
              alt="Team collaboration"
              className="mission-image"
            />
          </div>
        </section>

        <section className="team-section">
          <h2>Meet Our Team</h2>
          <div className="team-grid">
            {/* Team Member Cards */}
            <div className="team-member">
              <img src={speaker1} alt="Team member" />
              <h3>John Doe</h3>
              <p>CEO & Founder</p>
            </div>
            <div className="team-member">
              <img src={speaker2} alt="Team member" />
              <h3>Jane Smith</h3>
              <p>Head of Operations</p>
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
