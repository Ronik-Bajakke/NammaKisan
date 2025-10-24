import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";

// Import pages
import ChoiceLogin from "./pages/ChoiceLogin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import CustomerLogin from "./pages/CustomerLogin.jsx";
import CustomerSignup from "./pages/CustomerSignup.jsx";
import FarmerLogin from "./pages/FarmerLogin.jsx";

import AdminNavbar from "./pages/AdminNavbar.jsx";
import AdminAddProduct from "./pages/AdminAddProduct.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminFooter from "./pages/AdminFooter.jsx";
import AdminProductDetail from "./pages/AdminProductDetail.jsx";
import AdminProductEdit from "./pages/AdminProductEdit.jsx";
import AdminSearchResults from "./pages/AdminSearchResults.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminCustomers from "./pages/AdminCustomers.jsx";
import AdminFarmers from "./pages/AdminFarmers.jsx";
import AdminSales from "./pages/AdminSales.jsx";

import CustomerNavbar from "./pages/CustomerNavbar.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import CustomerFooter from "./pages/CustomerFooter.jsx";
import CustomerCart from "./pages/CustomerCart.jsx";
import Checkout from "./pages/Checkout.jsx";
import CustomerOrders from "./pages/CustomerOrders.jsx";

import FarmerDashboard from "./pages/FarmerDashboard.jsx";


const CheckoutWrapper = () => {
  const location = useLocation();
  return <Checkout totalAmount={location.state?.totalAmount || 0} />;
};


const CustomerDashboardWrapper = () => {
  const [resetSignal, setResetSignal] = useState(false);

  return (
    <div className="d-flex flex-column min-vh-100">
      <CustomerNavbar onResetCategory={() => setResetSignal(prev => !prev)} />
      <main className="flex-grow-1">
        <CustomerDashboard resetCategorySignal={resetSignal} />
      </main>
      <CustomerFooter />
    </div>
  );
};


const PageLayout = ({ Navbar, Content, Footer }) => (
  <div className="d-flex flex-column min-vh-100">
    {Navbar && <Navbar />}
    <main className="flex-grow-1">{Content}</main>
    {Footer && <Footer />}
  </div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
     
      <Route path="/" element={<ChoiceLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/customer/signup" element={<CustomerSignup />} />
      <Route path="/farmer/login" element={<FarmerLogin />} />

      
      <Route
        path="/admin/dashboard"
        element={<PageLayout Navbar={AdminNavbar} Content={<AdminDashboard />} Footer={AdminFooter} />}
      />
      <Route
        path="/admin/add-product"
        element={<PageLayout Navbar={AdminNavbar} Content={<AdminAddProduct />} Footer={AdminFooter} />}
      />
      <Route
        path="/admin/product/:id"
        element={<PageLayout Navbar={AdminNavbar} Content={<AdminProductDetail />} Footer={AdminFooter} />}
      />
      <Route
        path="/admin/product/edit/:id"
        element={<PageLayout Navbar={AdminNavbar} Content={<AdminProductEdit />} Footer={AdminFooter} />}
      />
      <Route
        path="/admin/search"
        element={<PageLayout Navbar={AdminNavbar} Content={<AdminSearchResults />} Footer={AdminFooter} />}
      />
      <Route
        path="/admin/orders"
        element={<PageLayout Navbar={AdminNavbar} Content={<AdminOrders />} Footer={AdminFooter} />}
      />
      <Route
        path="/admin/customers"
        element={<PageLayout Navbar={AdminNavbar} Content={<AdminCustomers />} Footer={AdminFooter} />}
      />
      <Route
        path="/admin/farmers"
        element={<PageLayout Navbar={AdminNavbar} Content={<AdminFarmers />} Footer={AdminFooter} />}
      />
      <Route
        path="/admin/sales"
        element={<PageLayout Navbar={AdminNavbar} Content={<AdminSales />} Footer={AdminFooter} />}
      />

      
      <Route path="/customer/dashboard" element={<CustomerDashboardWrapper />} />
      <Route
        path="/customer/cart"
        element={<PageLayout Navbar={CustomerNavbar} Content={<CustomerCart />} Footer={CustomerFooter} />}
      />
      <Route
        path="/customer/checkout"
        element={<PageLayout Navbar={CustomerNavbar} Content={<CheckoutWrapper />} Footer={CustomerFooter} />}
      />
      <Route
        path="/customer/orders"
        element={<PageLayout Navbar={CustomerNavbar} Content={<CustomerOrders />} Footer={CustomerFooter} />}
      />

     
      <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
    </Routes>
  </BrowserRouter>
);
