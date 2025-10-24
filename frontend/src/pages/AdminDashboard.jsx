import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        // Verify admin token
        await axios.get(`${API_BASE}/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch admin products
        const res = await axios.get(`${API_BASE}/admin/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter visible products
        const visibleProducts = res.data.filter((p) => {
          const remainingQty = (p.quantity || 0) - (p.quantitySold || 0);
          return remainingQty > 0 && !p.isDeleted;
        });

        setProducts(visibleProducts);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching admin products:", err);
        localStorage.removeItem("token");
        navigate("/admin/login");
      }
    };

    fetchProducts();
  }, [navigate]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container my-4">
      <style>{`
        .product-card {
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
        }
        .product-card img {
          display: block;
        }
        .product-card:hover img {
          opacity: 0.8;
        }
        .product-card:hover {
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
          transform: translateY(-5px);
        }
      `}</style>

      {products.length === 0 ? (
        <h5 className="text-center text-muted mt-4">No available products</h5>
      ) : (
        <div className="row g-4">
          {products.map((product) => {
            const remainingQty =
              (product.quantity || 0) - (product.quantitySold || 0);
            return (
              <div
                className="col-12 col-sm-6 col-lg-3"
                key={product._id}
                onClick={() => navigate(`/admin/product/${product._id}`)}
              >
                <div className="card h-100 shadow-sm border-0 product-card">
                  <img
                    src={product.productImage}
                    className="card-img-top"
                    alt={product.productName}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <p className="card-title fw-bold text-success mb-0">
                      {product.productName} - ₹{product.pricePerKg}/kg
                    </p>
                    <p className="text-muted mb-0">{product.category}</p>
                    <p
                      className="text-secondary mb-0"
                      style={{ fontSize: "0.85rem" }}
                    >
                      Farmer: {product.farmerName}
                    </p>
                    <p className="text-muted mt-1" style={{ fontSize: "0.85rem" }}>
                      Remaining: {remainingQty} kg
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
