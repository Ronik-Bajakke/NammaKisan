import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api";

const AdminFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await axios.get(`${API_BASE}/admin/farmers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFarmers(res.data);
      } catch (err) {
        console.error("Error fetching farmers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, [token]);

  if (loading) return <p className="text-center mt-5">Loading farmers...</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-success fw-bold">
        <i className="fa fa-tractor me-2"></i>Farmers Overview
      </h3>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-success">
            <tr>
              <th>Farmer Name</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Total Products</th>
              <th>Active</th>
              <th>Sold Out</th>
              <th>Earnings (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((f) => (
              <tr key={f.farmerMobile}>
                <td>{f.farmerName}</td>
                <td>{f.farmerMobile}</td>
                <td>{f.address}</td>
                <td>{f.totalProducts}</td>
                <td className="text-success fw-semibold">{f.active}</td>
                <td className="fw-semibold text-dark">{f.soldOut}</td>
                <td className="fw-semibold text-success">
                  ₹{f.totalEarnings.toLocaleString()}
                </td>
                <td>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => setSelectedFarmer(f)}
                  >
                    View Listings
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedFarmer && (
        <div
          className="modal show fade d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content rounded-3">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  {selectedFarmer.farmerName}'s Listings
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedFarmer(null)}
                ></button>
              </div>

              <div className="modal-body">
                {selectedFarmer.listings.length === 0 ? (
                  <p>No listings available.</p>
                ) : (
                  <>
                    <h5 className="fw-bold text-success mb-3">
                      <i className="fa fa-box me-2"></i>Active Listings
                    </h5>
                    <div className="table-responsive mb-4">
                      <table className="table table-bordered align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price/kg</th>
                            <th>Qty</th>
                            <th>Sold</th>
                            <th>Remaining</th>
                            <th>Total Sales (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedFarmer.listings
                            .filter((p) => p.quantity > (p.quantitySold || 0))
                            .map((p, idx) => {
                              const remaining = p.quantity - (p.quantitySold || 0);
                              const total = (p.quantitySold || 0) * p.pricePerKg;
                              return (
                                <tr key={p._id}>
                                  <td>{idx + 1}</td>
                                  <td>{p.productName}</td>
                                  <td>{p.category}</td>
                                  <td>{p.pricePerKg}</td>
                                  <td>{p.quantity}</td>
                                  <td>{p.quantitySold || 0}</td>
                                  <td className="text-success fw-semibold">
                                    {remaining}
                                  </td>
                                  <td className="text-success">
                                    ₹{total.toLocaleString()}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>

                    <h5 className="fw-bold text-success mb-3">Sold Out Listings</h5>
                    <div className="table-responsive">
                      <table className="table table-bordered align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price/kg</th>
                            <th>Qty</th>
                            <th>Sold</th>
                            <th>Remaining</th>
                            <th>Total Sales (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedFarmer.listings
                            .filter((p) => p.quantity <= (p.quantitySold || 0))
                            .map((p, idx) => {
                              const remaining = p.quantity - (p.quantitySold || 0);
                              const total = (p.quantitySold || 0) * p.pricePerKg;
                              return (
                                <tr key={p._id}>
                                  <td>{idx + 1}</td>
                                  <td>{p.productName}</td>
                                  <td>{p.category}</td>
                                  <td>{p.pricePerKg}</td>
                                  <td>{p.quantity}</td>
                                  <td className="fw-semibold text-success">
                                    {p.quantitySold || 0}
                                  </td>
                                  <td>{remaining}</td>
                                  <td className="text-success">
                                    ₹{total.toLocaleString()}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFarmers;
