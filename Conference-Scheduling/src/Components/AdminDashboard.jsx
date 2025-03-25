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

      <Footer />
      <ToastContainer />
    </>
  );
}

export default AdminDashboard;
