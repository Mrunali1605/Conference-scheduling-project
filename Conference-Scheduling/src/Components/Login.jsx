import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../Utile";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email && !password) {
      return handleError("Please enter your email and password");
    }

    if (!email) {
      return handleError("Please enter your email address");
    }

    if (!password) {
      return handleError("Please enter your password");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return handleError(
        "Invalid email format.Please check your email address."
      );
    }

    if (password.length < 6) {
      return handleError(
        "Password is too short - should be 6 characters or longer"
      );
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.success) {
        // Store token
        console.log("Login response:", data);
        localStorage.setItem("token", data.jwtToken);
        localStorage.setItem("loggedInUser", data.name);
        localStorage.setItem("userRole", data.isAdmin ? "admin" : "user");
localStorage.setItem("userId", data.userId);
        // if (!localStorage.getItem("todos")) {
        //   localStorage.setItem("todos", JSON.stringify([]));
        // }

        handleSuccess(data.message);

        setTimeout(() => {
          if (data.isAdmin) {
            navigate("/Home");
          } else {
            navigate("/Home");
          }
        }, 1000);
      } else {
        handleError(data.message);
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={loginInfo.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginInfo.password}
            onChange={handleChange}
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <span>
          Don't have an account? <Link to="/signUp">Sign Up</Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
