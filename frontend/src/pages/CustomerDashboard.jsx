import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../api.js"; // Import API_BASE from config

const categories = ["All", "Vegetables", "Fruits", "Others"];

const CustomerDashboard = ({ resetCategorySignal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null); // track hover

  // Reset category on signal
  useEffect(() => {
    if (resetCategorySignal) {
      setSelectedCategory("All");
      const url = new URL(window.location);
      url.searchParams.delete("search");
      window.history.replaceState({}, "", url);
    }
  }, [resetCategorySignal]);

  // Fetch customer profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("customerToken");
        if (!token) throw new Error("No token");

        const res = await axios.get(`${API_BASE}/customer/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomer(res.data);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Profile fetch failed:", error.response?.status || error.message);

        // Only logout if token is invalid
        if (error.response?.status === 401) {
          localStorage.removeItem("customerToken");
          navigate("/", { replace: true });
        }
      }
    };
    fetchProfile();
  }, [navigate]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const searchTerm = queryParams.get("search") || "";
        const categoryParam = selectedCategory !== "All" ? `&category=${selectedCategory}` : "";

        const res = await axios.get(`${API_BASE}/products?search=${searchTerm}${categoryParam}`);
        const availableProducts = res.data.filter(
          (p) => (p.quantity || 0) - (p.quantitySold || 0) > 0 && !p.isDeleted
        );
        setProducts(availableProducts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, [location.search, selectedCategory]);

  // Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("customerToken");
        const res = await axios.get(`${API_BASE}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartData = {};
        (res.data.items || []).forEach(
          (item) => (cartData[item.productId._id] = item.quantity)
        );
        setCart(cartData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCart();
  }, []);

  const handleAdd = async (productId) => {
    try {
      const product = products.find((p) => p._id === productId);
      if (!product) return;

      const remainingQty = (product.quantity || 0) - (product.quantitySold || 0);
      const currentQty = cart[productId] || 0;
      if (currentQty >= remainingQty) {
        alert(`⚠️ Only ${remainingQty}kg available for ${product.productName}`);
        return;
      }

      const token = localStorage.getItem("customerToken");
      let res;
      if (cart[productId]) {
        res = await axios.put(
          `${API_BASE}/cart/update/${productId}`,
          { action: "increase" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.post(
          `${API_BASE}/cart/add`,
          { productId, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      const updatedCart = {};
      (res.data.items || []).forEach(
        (item) => (updatedCart[item.productId._id] = item.quantity)
      );
      setCart(updatedCart);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecrease = async (productId) => {
    try {
      const token = localStorage.getItem("customerToken");
      let res;
      if (cart[productId] > 1) {
        res = await axios.put(
          `${API_BASE}/cart/update/${productId}`,
          { action: "decrease" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.delete(`${API_BASE}/cart/remove/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      const updatedCart = {};
      (res.data.items || []).forEach(
        (item) => (updatedCart[item.productId._id] = item.quantity)
      );
      setCart(updatedCart);
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAuthorized) return null;

  return (
    <div className="container my-4">
      <div className="mb-4 text-center">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            className={`btn me-2 mb-2 ${
              selectedCategory === cat ? "btn-success" : "btn-outline-success"
            }`}
            style={{ minWidth: "100px" }}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <h2 className="text-success mb-4 text-center">
        Welcome, {customer?.name || "Customer"}!
      </h2>

      <div className="row g-4">
        {products.length > 0 ? (
          products.map((product) => {
            const quantity = cart[product._id] || 0;
            const isHovered = hoveredCard === product._id;

            return (
              <div className="col-12 col-sm-6 col-lg-3" key={product._id}>
                <div
                  className="card h-100 shadow-sm border-0"
                  style={{
                    borderRadius: "15px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out",
                    boxShadow: isHovered
                      ? "0 12px 24px rgba(0,0,0,0.2)" 
                      : "0 4px 6px rgba(0,0,0,0.1)",
                    opacity: isHovered ? 0.9 : 1,
                    transform: isHovered ? "translateY(-5px)" : "translateY(0)",
                  }}
                  onMouseEnter={() => setHoveredCard(product._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {product.productImage && (
                    <img
                      src={product.productImage}
                      className="card-img-top"
                      alt={product.productName}
                      style={{
                        height: "230px",
                        objectFit: "cover",
                        transition: "opacity 0.2s ease-in-out",
                        opacity: isHovered ? 0.85 : 1,
                      }}
                    />
                  )}
                  <div className="card-body text-center">
                    <p className="fw-bold text-success mb-2">
                      {product.productName} - ₹{product.pricePerKg}/kg
                    </p>

                    {quantity === 0 ? (
                      <button
                        className="btn btn-success w-75"
                        onClick={() => handleAdd(product._id)}
                      >
                        <i className="fa fa-cart-plus me-2"></i> Add to Cart
                      </button>
                    ) : (
                      <div className="d-flex justify-content-center align-items-center w-75 mx-auto">
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleDecrease(product._id)}
                        >
                          −
                        </button>
                        <span className="mx-2 fw-bold">{quantity}</span>
                        <button
                          className="btn btn-outline-success"
                          onClick={() => handleAdd(product._id)}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-muted">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
