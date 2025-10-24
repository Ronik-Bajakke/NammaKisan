import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css"; // ✅ Import CSS
import { API_BASE } from "../api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/admin/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      alert("Login Successful ✅");
      navigate("/admin/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid Credentials ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
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
          <i className="fa fa-user-secret me-2"></i> Admin Login
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="fa fa-envelope me-2"></i>Email ID
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              <i className="fa fa-lock me-2"></i>Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-semibold"
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
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
