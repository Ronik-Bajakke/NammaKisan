import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./CustomerLogin.css"; // ✅ Import CSS file
import { API_BASE } from "../api.js";

const CustomerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/customer/login`, formData);
      localStorage.setItem("customerToken", res.data.token);
      alert("Login Successful ✅");
      navigate("/customer/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-login-page">
      <div
        className="card p-5 shadow-lg bg-white bg-opacity-75"
        style={{
          borderRadius: "20px",
          width: "90%",
          maxWidth: "400px",
          zIndex: 2,
        }}
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

          <button
            className="btn btn-success w-100 fw-semibold mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa fa-spinner fa-spin me-2"></i> Logging in...
              </>
            ) : (
              <>
                <i className="fa fa-sign-in me-2"></i> Login
              </>
            )}
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
