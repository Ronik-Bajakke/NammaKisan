import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginChoice1 from "../assets/images/LoginChoice.jpg";
import axios from "axios";

const FarmerLogin = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/farmer/login", {
        farmerMobile: mobile,
        farmerPassword: password,
      });

      localStorage.setItem("farmerToken", res.data.token);
      navigate("/farmer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
      <div className="card p-4 shadow-lg bg-white bg-opacity-75" style={{ borderRadius: "20px", minWidth: "400px", maxWidth: "90%" }}>
        <h2 className="text-center mb-3 text-success fw-bold">
          <i className="fa fa-user me-2"></i> Farmer Login
        </h2>

        <form onSubmit={handleLogin}>
          <div className="mb-2">
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

          {error && <p className="text-danger">{error}</p>}

          <button type="submit" className="btn btn-success w-100 fw-semibold mb-2">
            <i className="fa fa-sign-in me-2"></i> Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default FarmerLogin;
