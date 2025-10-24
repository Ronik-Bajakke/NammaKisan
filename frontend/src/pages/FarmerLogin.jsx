import React, { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom";
import "./FarmerLogin.css"; // ✅ import CSS
import axios from "axios";
import { API_BASE } from "../api"; // import API base

const FarmerLogin = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/farmer/login`, {
        farmerMobile: mobile,
        farmerPassword: password,
      });

      localStorage.setItem("farmerToken", res.data.token);
      alert("Login Successful ✅");
      navigate("/farmer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="farmer-login-page">
      <div
        className="card p-4 shadow-lg bg-white bg-opacity-75"
        style={{
          borderRadius: "20px",
          width: "90%",
          maxWidth: "400px",
          zIndex: 2,
        }}
      >
        <h2 className="text-center mb-4 text-success fw-bold">
          <i className="fa fa-user me-2"></i> Farmer Login
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">📱 Mobile Number</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">🔒 Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-danger text-center fw-semibold">{error}</p>}

          <button
            type="submit"
            className="btn btn-success w-100 fw-semibold mb-2"
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

          <p className="text-center text-muted mt-2">
            Don’t have an account?{" "}
            <Link
              to="/farmer/signup"
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

export default FarmerLogin;
