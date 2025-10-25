import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminAddProduct.css"; // ✅ external CSS for background
import { API_BASE } from "../api";

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    farmerName: "",
    productName: "",
    productImage: null,
    farmerMobile: "",
    quantity: "",
    minBuy: "",
    category: "",
    address: "",
    pricePerKg: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Not logged in");
        navigate("/admin/login");
        return;
      }

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) data.append(key, formData[key]);
      });

      setLoading(true);
      const res = await axios.post(`${API_BASE}/admin/add-product`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("✅ Product added successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to add product ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-add-product-page">
      <div className="admin-add-overlay">
        <div
          className="card p-4 shadow-lg bg-white bg-opacity-75 mx-auto"
          style={{
            borderRadius: "20px",
            width: "90%",
            maxWidth: "760px",
            zIndex: 2,
          }}
        >
          <h2 className="text-center mb-4 text-success fw-bold">
            <i className="fa fa-plus-circle me-2"></i> Add Product
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Farmer Name</label>
                <input
                  type="text"
                  name="farmerName"
                  className="form-control mb-2"
                  placeholder="Enter farmer's full name"
                  onChange={handleChange}
                  required
                />

                <label className="form-label fw-semibold">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  className="form-control mb-2"
                  placeholder="Enter product name"
                  onChange={handleChange}
                  required
                />

                <label className="form-label fw-semibold">Product Image</label>
                <input
                  type="file"
                  name="productImage"
                  className="form-control mb-2"
                  onChange={handleChange}
                  accept="image/*"
                  required
                />

                <label className="form-label fw-semibold">
                  Price per Kg (₹)
                </label>
                <input
                  type="number"
                  name="pricePerKg"
                  className="form-control mb-2"
                  placeholder="Enter price per Kg"
                  min="0"
                  step="0.01"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Farmer Mobile</label>
                <input
                  type="tel"
                  name="farmerMobile"
                  className="form-control mb-2"
                  placeholder="Enter farmer's mobile number"
                  pattern="[0-9]{10}"
                  onChange={handleChange}
                  required
                />

                <label className="form-label fw-semibold">Quantity (Kg)</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control mb-2"
                  placeholder="Total quantity available"
                  min="0"
                  step="0.1"
                  onChange={handleChange}
                  required
                />

                <label className="form-label fw-semibold">Minimum Buy</label>
                <select
                  className="form-select mb-2"
                  name="minBuy"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select minimum buy quantity</option>
                  <option value="1">1 kg</option>
                </select>

                <label className="form-label fw-semibold">Category</label>
                <select
                  className="form-select mb-2"
                  name="category"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Farmer Address</label>
                <textarea
                  className="form-control mb-2"
                  name="address"
                  placeholder="Enter farmer's address"
                  rows="2"
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="text-center mt-3">
              <button
                className="btn btn-success w-50 fw-semibold"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fa fa-spinner fa-spin me-2"></i> Adding...
                  </>
                ) : (
                  <>
                    <i className="fa fa-plus-circle me-2"></i> Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;
