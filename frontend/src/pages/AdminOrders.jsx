import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

       
        const sanitizedOrders = res.data
          .map((order) => ({
            ...order,
            items: order.items.filter((i) => i.productId),
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(sanitizedOrders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  
  const markDelivered = async (orderId) => {
    if (!window.confirm("Are you sure you want to mark this order as delivered?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/orders/${orderId}/deliver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "Delivered" } : order
        )
      );
    } catch (err) {
      console.error("Failed to mark delivered:", err);
      alert("Failed to update order status");
    }
  };

 
  const cancelOrder = async (orderId) => {
    const reason = prompt("Please enter the reason for cancelling this order:");
    if (!reason || !reason.trim()) return alert("Cancellation reason is required!");

    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/admin/orders/${orderId}/cancel`,
        { cancelReason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Order cancelled successfully! Reason: ${res.data.cancelReason}`);

      
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: "Cancelled", cancelReason: res.data.cancelReason }
            : order
        )
      );
    } catch (err) {
      console.error("Failed to cancel order:", err);
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading orders...</p>;

  if (orders.length === 0)
    return (
      <div className="text-center mt-5 text-muted">
        <p style={{ fontSize: "1.2rem" }}>No orders yet.</p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2910/2910763.png"
          alt="No Orders"
          style={{ width: "150px", opacity: 0.5 }}
        />
      </div>
    );

  return (
    <div className="container my-5">
      <h3 className="text-success mb-4">📦 Customer Orders</h3>
      <div className="row g-4">
        {orders.map((order) => (
          <div key={order._id} className="col-12 col-md-6 col-lg-4">
            <div
              className={`card shadow-sm border-0 h-100 ${
                order.status === "Cancelled" ? "bg-light" : ""
              }`}
            >
              <div
                className={`card-header d-flex justify-content-between align-items-center ${
                  order.status === "Delivered"
                    ? "bg-success text-white"
                    : order.status === "Cancelled"
                    ? "bg-danger text-white"
                    : "bg-warning text-dark"
                }`}
              >
                <span>
                  <strong>{order.status}</strong> | Order ID: {order._id.slice(-6)}
                </span>
                <span className="badge bg-primary">₹{order.totalAmount}</span>
              </div>

              <div className="card-body">
                <p className="mb-1">
                  <strong>Customer:</strong> {order.customerId?.name} ({order.customerId?.email})
                </p>
                <p className="mb-1">
                  <strong>Address:</strong> {order.address}
                </p>
                <p className="mb-1 text-muted" style={{ fontSize: "0.85rem" }}>
                  Ordered on: {new Date(order.createdAt).toLocaleString()}
                </p>
                <hr />
                <strong>Items:</strong>
                <ul className="list-group list-group-flush mt-2">
                  {order.items.map((item) =>
                    item.productId ? (
                      <li
                        key={item.productId._id}
                        className="list-group-item d-flex justify-content-between align-items-center px-0"
                      >
                        <span>{item.productId.productName}</span>
                        <span>
                          {item.quantity} × ₹{item.pricePerKg} = ₹
                          {item.quantity * item.pricePerKg}
                        </span>
                      </li>
                    ) : (
                      <li
                        key={item._id}
                        className="list-group-item d-flex justify-content-between align-items-center px-0 text-danger"
                      >
                        Product removed
                      </li>
                    )
                  )}
                </ul>

                {order.status === "Cancelled" && order.cancelReason && (
                  <div className="alert alert-danger mt-3 py-2 mb-0">
                    <strong>❌ Cancel Reason:</strong> {order.cancelReason}
                  </div>
                )}
              </div>

              
              <div className="card-footer d-flex justify-content-between">
                {order.status === "Pending" && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => markDelivered(order._id)}
                    >
                      Mark as Delivered
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => cancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  </>
                )}
                {order.status === "Delivered" && (
                  <span className="text-success fw-bold">Delivered ✅</span>
                )}
                {order.status === "Cancelled" && (
                  <span className="text-danger fw-bold">Cancelled ❌</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
