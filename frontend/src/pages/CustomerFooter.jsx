import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerFooter = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    setIsAuthorized(true);
  }, [navigate]);

  if (!isAuthorized) return null; 

  return (
    <footer
      className="text-dark text-center py-3 mt-4"
      style={{
        backgroundColor: "#f8f9fa",
        fontSize: "0.9rem",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <div>
        © 2025 <span className="fw-bold">NammaKisan</span> | v1.0.0
      </div>
      <div>
        Logged in as <span className="fw-semibold">Customer</span>
      </div>
    </footer>
  );
};

export default CustomerFooter;
