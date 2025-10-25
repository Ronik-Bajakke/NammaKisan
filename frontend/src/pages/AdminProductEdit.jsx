import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api";
import "../styles/AdminEditProduct.css"; // <-- add your custom style here

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProduct(res.data);
        setFormData({
          farmerName: res.data.farmerName,
          productName: res.data.productName,
          productImage: null,
          farmerMobile: res.data.farmerMobile,
          quantity: res.data.quantity,
          minBuy: res.data.minBuy,
          category: res.data.category,
          address: res.data.address,
          pricePerKg: res.data.pricePerKg,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate("/admin/dashboard");
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) data.append(key, formData[key]);
      });

      const res = await axios.put(`${API_BASE}/admin/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        alert("✅ Product updated successfully!");
        navigate(`/admin/product/${id}`);
      }
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to update product");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (!product) return <p className="text-center mt-5">Product not found.</p>;

  return (
    <div className="admin-edit-product-page">
      <div className="admin-edit-overlay">
        <div className="container mt-5" style={{ maxWidth: "800px" }}>
          <h2 className="text-center mb-4 text-success fw-bold">Edit Product</h2>
          <div className="card border-0 shadow-sm p-3">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-2">
                <label className="form-label">Farmer Name</label>
                <input
                  type="text"
                  name="farmerName"
                  className="form-control"
                  value={formData.farmerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  name="productName"
                  className="form-control"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Current Image</label>
                {product.productImage && (
                  <img
                    src={product.productImage}
                    alt="Current"
                    style={{ maxHeight: "120px", marginBottom: "5px" }}
                  />
                )}
                <input
                  type="file"
                  name="productImage"
                  className="form-control"
                  onChange={handleChange}
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Price per Kg (₹)</label>
                <input
                  type="number"
                  name="pricePerKg"
                  className="form-control"
                  value={formData.pricePerKg}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Farmer Mobile</label>
                <input
                  type="tel"
                  name="farmerMobile"
                  className="form-control"
                  value={formData.farmerMobile}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Quantity (kg)</label>
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Minimum Buy (kg)</label>
                <input
                  type="number"
                  name="minBuy"
                  className="form-control"
                  value={formData.minBuy}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-2">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button type="submit" className="btn btn-success">
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(`/admin/product/${id}`)}
                >
                  ❌ Cancel
                </button>
              </div>
            </form>
          </div>
          <button
            className="btn btn-success mt-3 w-100 mb-5"
            onClick={() => navigate("/admin/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProduct;
