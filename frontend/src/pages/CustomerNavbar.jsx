import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CustomerNavbar = ({ onResetCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    setIsAuthorized(true);
  }, [navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearch(params.get("search") || "");
  }, [location.search]);

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    navigate("/", { replace: true });
  };

  const goToAllProducts = () => {
    if (onResetCategory) onResetCategory(); // Reset category in dashboard
    navigate("/customer/dashboard", { replace: true });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(
      search.trim()
        ? `/customer/dashboard?search=${encodeURIComponent(search)}`
        : "/customer/dashboard",
      { replace: true }
    );
  };

  if (!isAuthorized) return null;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light px-4 shadow-sm mt-2"
      style={{ minHeight: "70px", fontSize: "1.05rem", backgroundColor: "#f8f9fa", borderRadius: "10px" }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo */}
        <span
          className="navbar-brand fw-bold text-success"
          style={{ cursor: "pointer" }}
          onClick={goToAllProducts}
        >
          <i className="fa fa-leaf me-2"></i> NammaKisan
        </span>

        {/* Search Bar */}
        <form
          className="d-flex justify-content-center align-items-center mx-auto"
          style={{ maxWidth: "500px", width: "100%" }}
          onSubmit={handleSearchSubmit}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search Vegetables, Fruits, Farmers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline-success" type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>

        {/* Right Menu */}
       <ul className="navbar-nav d-flex flex-row align-items-center mb-0">
  <li className="nav-item me-3">
    <span
      className="nav-link fw-semibold text-success"
      style={{ cursor: "pointer" }}
      onClick={goToAllProducts}
    >
      <i className="fa fa-home me-1"></i> Home
    </span>
  </li>
  <li className="nav-item me-3">
    <span
      className="nav-link fw-semibold text-success"
      style={{ cursor: "pointer" }}
      onClick={() => navigate("/customer/cart")}
    >
      <i className="fa fa-shopping-cart me-1"></i> Cart
    </span>
  </li>
  <li className="nav-item me-3">
    <span
      className="nav-link fw-semibold text-success"
      style={{ cursor: "pointer" }}
      onClick={() => navigate("/customer/orders")}
    >
      <i className="fa fa-box me-1"></i> Orders
    </span>
  </li>
  <li className="nav-item">
    <button
      className="btn nav-link fw-semibold text-danger"
      onClick={handleLogout}
      style={{ background: "none", border: "none", cursor: "pointer" }}
    >
      <i className="fa fa-sign-out me-1"></i> Logout
    </button>
  </li>
</ul>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
