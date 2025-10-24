import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import LoginChoice1 from "../assets/images/LoginChoice.jpg";
import { API_BASE } from "../config"; // make sure you have this exported from config.js

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/customer/login`, formData);
      localStorage.setItem("customerToken", res.data.token);
      navigate("/customer/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
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
        className="card p-5 shadow-lg bg-white bg-opacity-75"
        style={{ borderRadius: "20px", minWidth: "400px" }}
      >
        <h2 className="text-center mb-4 text-success fw-bold">
          <i className="fa fa-user me-2"></i> Customer Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="fa fa-envelope me-2"></i>Email ID
            </label>
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

          <div className="mb-4">
            <label className="form-label fw-semibold">
              <i className="fa fa-lock me-2"></i>Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your password"
              required
            />
          </div>

          <button className="btn btn-success w-100 fw-semibold mb-3">
            <i className="fa fa-sign-in me-2"></i> Login
          </button>

          <p className="text-center text-muted mt-3">
            Don’t have an account?{" "}
            <Link
              to="/customer/signup"
              className="text-success fw-semibold text-decoration-none"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default CustomerLogin;
