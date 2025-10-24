import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE } from "../api"; // for future API calls

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/", { replace: true });
      return;
    }
    setIsAuthorized(true);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const handleAddProduct = () => {
    navigate("/admin/add-product");
  };

  if (!isAuthorized) return null;

  return (
    <nav
      className="navbar navbar-expand-lg px-4 shadow-sm mt-2"
      style={{
        minHeight: "70px",
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fw-bold text-success" to="/admin/dashboard">
          <i className="fa fa-leaf me-2"></i> NammaKisan
        </Link>

        <form
          className="d-flex mx-auto"
          style={{ maxWidth: "500px", width: "100%" }}
          onSubmit={(e) => {
            e.preventDefault();
            const query = e.target.elements.search.value.trim();
            if (query) navigate(`/admin/search?q=${query}`);
          }}
        >
          <input
            id="search"
            name="search"
            className="form-control me-2"
            type="search"
            placeholder="Search Products, Farmers, Categories..."
          />
          <button className="btn btn-outline-success" type="submit">
            <i className="fa fa-search"></i>
          </button>
        </form>

        <ul className="navbar-nav d-flex flex-row align-items-center mb-0">
          <li className="nav-item me-3">
            <button className="btn btn-success me-3" onClick={handleAddProduct}>
              <i className="fa fa-plus me-2"></i> Add Product
            </button>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link dropdown-toggle fw-semibold"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <i className="fa fa-user me-1"></i> Admin
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to="/admin/farmers">Farmers</Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/admin/customers">Customers</Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/admin/orders">Orders</Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/admin/sales">Sales</Link>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <button className="dropdown-item text-danger" onClick={handleLogout}>
                  <i className="fa fa-sign-out me-2"></i> Logout
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavbar;
