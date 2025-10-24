import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import LoginChoice1 from "../assets/images/LoginChoice.jpg";
import { API_BASE } from "../api"; // import your base URL

const CustomerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Use API_BASE from api.js
      const res = await axios.post(`${API_BASE}/customer/signup`, {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
      });

      localStorage.setItem("customerToken", res.data.token);
      navigate("/customer/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `url(${LoginChoice1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card p-4 shadow-lg bg-white bg-opacity-75"
        style={{ borderRadius: "20px", minWidth: "400px" }}
      >
        <h2 className="text-center mb-4 text-success fw-bold">
          <i className="fa fa-user-plus me-2"></i> Customer Sign Up
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold">Email ID</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold">Mobile Number</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your mobile number"
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button className="btn btn-success w-100 fw-semibold mb-2" type="submit">
            <i className="fa fa-user-plus me-2"></i> Sign Up
          </button>

          <p className="text-center text-muted mt-2">
            Already have an account?{" "}
            <Link to="/customer/login" className="text-success fw-semibold text-decoration-none">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CustomerSignup;
