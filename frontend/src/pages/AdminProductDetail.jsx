import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/admin/products/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/admin/login");
        } else {
          setError("Failed to load product details. Please try again later.");
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `http://localhost:5000/api/admin/products/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 200) {
        alert("✅ Product deleted successfully!");
        navigate("/admin/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;
  if (!product) return <p className="text-center mt-5">Product not found.</p>;

  return (
    <div className="container mt-5 mb-5" style={{ maxWidth: "800px" }}>
      <style>{`
        .detail-card {
          border-radius: 15px;
          background-color: #fff;
          transition: box-shadow 0.2s ease;
        }
        .detail-card:hover {
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .detail-label {
          font-weight: 600;
          color: #198754;
        }
        .detail-value {
          color: #333;
        }
      `}</style>

      <h2 className="text-center mb-4 text-success fw-bold">
        {product.productName}
      </h2>

      <div className="card border-0 shadow-sm p-3 detail-card">
        {product.productImage && (
          <img
            src={product.productImage}
            alt={product.productName}
            className="img-fluid rounded mb-3"
            style={{
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        )}

        <div className="mt-3">
          <p>
            <span className="detail-label">🌾 Farmer Name:</span>{" "}
            <span className="detail-value">{product.farmerName}</span>
          </p>
          <p>
            <span className="detail-label">📂 Category:</span>{" "}
            <span className="detail-value">{product.category}</span>
          </p>
          <p>
            <span className="detail-label">📍 Address:</span>{" "}
            <span className="detail-value">{product.address}</span>
          </p>
          <p>
            <span className="detail-label">📦 Quantity:</span>{" "}
            <span className="detail-value">{product.quantity} kg</span>
          </p>
          <p>
            <span className="detail-label">🧺 Minimum Buy:</span>{" "}
            <span className="detail-value">{product.minBuy} kg</span>
          </p>
          <p>
            <span className="detail-label">💰 Price per Kg:</span>{" "}
            <span className="detail-value">₹{product.pricePerKg}</span>
          </p>
          <p>
            <span className="detail-label">📱 Farmer Mobile:</span>{" "}
            <span className="detail-value">{product.farmerMobile}</span>
          </p>

          
          <p>
            <span className="detail-label">🔑 Farmer Password:</span>{" "}
            <span className="detail-value text-primary fw-bold">
              {product.farmerPassword || "Not available"}
            </span>
          </p>

          
          <p>
            <span className="detail-label">🕒 Uploaded On:</span>{" "}
            <span className="detail-value">
              {new Date(product.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </p>

          
          <p>
            <span className="detail-label">🆔 Product ID:</span>{" "}
            <span className="detail-value text-primary fw-bold">
              {product._id}
            </span>
          </p>
        </div>

        <div className="d-flex justify-content-between mt-3">
          <button
            className="btn btn-warning"
            onClick={() => navigate(`/admin/product/edit/${id}`)}
          >
            ✏️ Edit
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            🗑️ Delete
          </button>
        </div>

        <button
          className="btn btn-success mt-3 w-100 mb-5"
          onClick={() => navigate("/admin/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AdminProductDetail;
