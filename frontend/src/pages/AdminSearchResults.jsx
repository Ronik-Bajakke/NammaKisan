import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminSearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        
        const res = await axios.get(`http://localhost:5000/api/admin/products/search?q=${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProducts(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch search results.");
        setLoading(false);
      }
    };

    if (query) fetchProducts();
    else setLoading(false);
  }, [query, navigate]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  if (!products.length) return <p className="text-center mt-5">No products found for "{query}"</p>;

  return (
    <div className="container my-4">
      <h4 className="mb-3 text-success">Search results for "{query}"</h4>
      <div className="row g-4">
        {products.map((product) => (
          <div className="col-12 col-sm-6 col-lg-3" key={product._id}>
            <div className="card h-100 shadow-sm border-0">
              <img
                src={product.productImage}
                alt={product.productName}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <p className="card-title fw-bold text-success mb-0">
                  {product.productName} - ₹{product.pricePerKg}/kg
                </p>
                <p className="text-muted mb-0">{product.category}</p>
                <p className="text-secondary mb-0">Farmer: {product.farmerName}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminSearchResults;
