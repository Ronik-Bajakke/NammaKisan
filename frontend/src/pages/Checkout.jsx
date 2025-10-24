import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api"; // <-- import API_BASE

const Checkout = ({ totalAmount }) => {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      alert("Please enter your delivery address!");
      return;
    }

    try {
      const token = localStorage.getItem("customerToken");

      await axios.post(
        `${API_BASE}/orders`,
        { address, totalAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order placed successfully!");
      navigate("/customer/dashboard");
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Something went wrong. Try again!");
    }
  };

  const handleBack = () => {
    navigate("/customer/cart");
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm p-4">
            <h3 className="text-center text-success mb-4">Checkout</h3>

            <div className="mb-3">
              <label className="form-label fw-semibold">Delivery Address</label>
              <textarea
                className="form-control"
                placeholder="Enter your full delivery address..."
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></textarea>
            </div>

            <div className="text-center mb-3">
              <h5>
                Total Payable: <span className="text-success">₹{totalAmount}</span>
              </h5>
            </div>

            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={handleBack}>
                ← Back to Cart
              </button>
              <button className="btn btn-success" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
