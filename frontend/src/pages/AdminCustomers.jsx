import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [deliveredCounts, setDeliveredCounts] = useState({});

  const token = localStorage.getItem("token");

  
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(res.data);
      } catch (err) {
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [token]);

 
  useEffect(() => {
    const fetchDeliveredCounts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const delivered = res.data.filter((o) => o.status === "Delivered");

        
        const counts = {};
        delivered.forEach((order) => {
          const customerId = order.customerId?._id;
          if (customerId) {
            counts[customerId] = (counts[customerId] || 0) + 1;
          }
        });

        setDeliveredCounts(counts);
      } catch (err) {
        console.error("Error fetching delivered counts:", err);
      }
    };

    fetchDeliveredCounts();
  }, [token]);

  
  const fetchOrders = async (customerId) => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filtered = res.data
        .filter(
          (o) => o.customerId?._id === customerId && o.status === "Delivered"
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(filtered);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleViewOrders = (customer) => {
    setSelectedCustomer(customer);
    fetchOrders(customer._id);
  };

  if (loading) return <p className="text-center mt-5">Loading customers...</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-success fw-bold">
        <i className="fa fa-users me-2"></i>Customer Details
      </h3>

     
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-success">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Delivered Orders</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.mobile}</td>
                <td>{deliveredCounts[c._id] || 0}</td>
                <td>
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => handleViewOrders(c)}
                  >
                    View Orders
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      {selectedCustomer && (
        <div
          className="modal show fade d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content rounded-3">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  Delivered Orders for {selectedCustomer.name}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedCustomer(null)}
                ></button>
              </div>

              <div
                className="modal-body"
                style={{ maxHeight: "75vh", overflowY: "auto" }}
              >
                {orders.length === 0 ? (
                  <p className="text-center text-muted">
                    No delivered orders found.
                  </p>
                ) : (
                  <div className="accordion" id="orderAccordion">
                    {orders.map((order, i) => {
                      const totalOrderPrice = order.items.reduce(
                        (sum, item) => sum + item.quantity * item.pricePerKg,
                        0
                      );

                      const orderNumber = orders.length - i; 

                      return (
                        <div
                          className="card mb-3 border-0 shadow-sm"
                          key={order._id}
                        >
                          <div
                            className="card-header bg-light d-flex justify-content-between align-items-center"
                            style={{ cursor: "pointer" }}
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${i}`}
                            aria-expanded="true"
                          >
                            <h6 className="mb-0 text-success">
                              <strong>Order #{orderNumber}</strong> &nbsp;|&nbsp;
                              <span className="text-muted">
                                ID: <code>{order._id}</code>
                              </span>
                            </h6>
                            <span className="text-success fw-bold">
                              ₹{totalOrderPrice}
                            </span>
                          </div>

                          <div
                            id={`collapse${i}`}
                            className="collapse show"
                            data-bs-parent="#orderAccordion"
                          >
                            <div className="card-body">
                              <table className="table table-bordered table-sm">
                                <thead className="table-success">
                                  <tr>
                                    <th>Product</th>
                                    <th>Farmer Name</th>
                                    <th>Farmer Mobile</th>
                                    <th>Qty (kg)</th>
                                    <th>Price/kg</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {order.items.map((item, idx) => (
                                    <tr key={idx}>
                                      <td>{item.productId?.productName}</td>
                                      <td>{item.productId?.farmerName || "-"}</td>
                                      <td>{item.productId?.farmerMobile || "-"}</td>
                                      <td>{item.quantity}</td>
                                      <td>₹{item.pricePerKg}</td>
                                      <td>₹{item.quantity * item.pricePerKg}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                              <div className="text-end fw-bold text-success">
                                Order Total: ₹{totalOrderPrice}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;
