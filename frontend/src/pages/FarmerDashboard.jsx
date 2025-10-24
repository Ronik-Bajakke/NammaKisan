import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FarmerDashboard = () => {
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("farmerToken");
        if (!token) throw new Error("No token");

        const res = await axios.get("http://localhost:5000/api/farmer/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarmer(res.data);
      } catch (err) {
        localStorage.removeItem("farmerToken");
        navigate("/farmer/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("farmerToken");
        if (!token) throw new Error("No token");

        const res = await axios.get("http://localhost:5000/api/farmer/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("farmerToken");
    navigate("/");
  };

  if (!farmer) return <p className="text-center mt-5">Loading farmer info...</p>;
  if (loading) return <p className="text-center mt-5">Loading products...</p>;

  
  const availableProducts = products
    .filter((p) => p.quantity - (p.quantitySold || 0) > 0)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const soldOutProducts = products
    .filter((p) => p.quantity - (p.quantitySold || 0) <= 0)
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      return dateB - dateA;
    });

  
  const renderProductCard = (product, isSoldOut = false) => {
    const quantityRemaining = product.quantity - (product.quantitySold || 0);
    const totalSales = (product.quantitySold || 0) * product.pricePerKg;

    return (
      <div className="col-12 col-sm-6 col-lg-3" key={product._id}>
        <div
          className="card h-100 shadow-sm border-0"
          style={{ borderRadius: "15px" }}
        >
          {product.productImage && (
            <img
              src={product.productImage}
              className="card-img-top"
              alt={product.productName}
              style={{ height: "230px", objectFit: "cover" }}
            />
          )}
          <div className="card-body text-center">
            <p className="fw-bold text-success mb-2">{product.productName}</p>
            <p className="mb-1">Quantity: {product.quantity} kg</p>
            <p className="mb-1">Min Buy: {product.minBuy} kg</p>
            <p className="mb-1">Price: ₹{product.pricePerKg}/kg</p>
            <p className="mb-1">Quantity Sold: {product.quantitySold || 0} kg</p>
            <p className="mb-1">Remaining: {quantityRemaining} kg</p>
            <p className="mb-1 fw-semibold text-primary">
              Sales: ₹{totalSales.toLocaleString()}
            </p>
            <p className="text-muted small">Product ID: {product._id}</p>

            {isSoldOut && (
              <button className="btn btn-danger w-100 mt-2" disabled>
                Sold Out
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container my-5">
      
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          backgroundColor: "#f8f9fa",
          padding: "12px 20px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ color: "#198754", fontWeight: "700", margin: 0 }}>
          {farmer?.name ? `Welcome, ${farmer.name}` : "Your Listed Products"}
        </h3>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
        >
          Logout
        </button>
      </div>

     

     
      {availableProducts.length > 0 ? (
        <div className="row g-4 mb-5">
          {availableProducts.map((product) => renderProductCard(product))}
        </div>
      ) : (
        <p className="text-center text-muted">No available products.</p>
      )}

      <hr />

     
      <h4 className="mt-4 mb-3 text-center text-danger">Sold Out Products</h4>
      {soldOutProducts.length > 0 ? (
        <div className="row g-4">
          {soldOutProducts.map((product) => renderProductCard(product, true))}
        </div>
      ) : (
        <p className="text-center text-muted">No sold out products.</p>
      )}
    </div>
  );
};

export default FarmerDashboard;
