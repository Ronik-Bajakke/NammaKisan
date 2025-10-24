import React from "react";
import { useNavigate } from "react-router-dom";
import LoginChoice1 from "../assets/images/LoginChoice.jpg";

const ChoiceLogin = () => {
  const navigate = useNavigate();

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
        className="card text-center p-5 shadow-lg bg-white bg-opacity-75"
        style={{ borderRadius: "20px", minWidth: "350px" }}
      >
        <h1 className="mb-4 display-4 font-weight-bold text-success">
          <i className="fa fa-leaf mr-2"></i> NammaKisan
        </h1>
        <p className="text-muted mb-5">Choose your role to continue</p>

        <div className="d-grid gap-3">
         
          <button
            className="btn btn-success btn-lg"
            onClick={() => navigate("/admin/login")}
          >
            <i className="fa fa-user-secret mr-2"></i> Admin
          </button>

          
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/customer/login")}
          >
            <i className="fa fa-user mr-2"></i> Customer
          </button>

         
          <button
            className="btn btn-warning btn-lg text-white"
            onClick={() => navigate("/farmer/login")}
          >
            <i className="fa fa-truck mr-2"></i> Farmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChoiceLogin;
