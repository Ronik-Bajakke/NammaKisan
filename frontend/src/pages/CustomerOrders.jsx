import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState({});
  const [reviewInputs, setReviewInputs] = useState({});
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch customer profile
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const token = localStorage.getItem("customerToken");
        if (!token) throw new Error("No token found");

        const res = await axios.get("http://localhost:5000/api/customer/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomer(res.data);
      } catch (err) {
        console.error("Failed to fetch customer:", err);
        localStorage.removeItem("customerToken");
      }
    };
    fetchCustomer();
  }, []);

  // Fetch orders and existing reviews
  useEffect(() => {
    const fetchOrdersWithReviews = async () => {
      try {
        const token = localStorage.getItem("customerToken");
        const resOrders = await axios.get("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedOrders = resOrders.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const reviewData = {};
        for (let order of sortedOrders) {
          const firstItem = order.items.find((i) => i.productId);
          if (!firstItem) continue;
          const productId = firstItem.productId._id;

          const resReview = await axios.get(
            `http://localhost:5000/api/reviews?orderId=${order._id}&productId=${productId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (resReview.data) {
            reviewData[order._id] = {
              rating: resReview.data.rating,
              comment: resReview.data.comment,
            };
          }
        }

        setOrders(sortedOrders);
        setReviews(reviewData);
      } catch (err) {
        console.error("Failed to fetch orders or reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersWithReviews();
  }, []);

  // Handle review input changes
  const handleReviewChange = (orderId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [orderId]: { ...prev[orderId], [field]: value },
    }));
  };

  // Submit a new review
  const submitReview = async (order) => {
    try {
      if (!customer) return alert("Customer data not loaded");

      const { rating = 0, comment = "" } = reviewInputs[order._id] || {};
      if (!rating || rating < 1 || rating > 5)
        return alert("Please select a rating (1-5 stars)!");
      if (!comment.trim())
        return alert("Please write a comment for the review!");

      const token = localStorage.getItem("customerToken");
      const firstItem = order.items.find((i) => i.productId);
      if (!firstItem) return alert("Cannot submit review: product missing");
      const productId = firstItem.productId._id;

      await axios.post(
        "http://localhost:5000/api/reviews",
        {
          orderId: order._id,
          productId,
          customerId: customer._id,
          customerName: customer.name,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews((prev) => ({
        ...prev,
        [order._id]: { rating, comment },
      }));
      setReviewInputs((prev) => ({ ...prev, [order._id]: {} }));
    } catch (err) {
      console.error("Failed to submit review:", err);
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  // Star rating component
  const StarRating = ({ rating, onChange, readOnly }) => (
    <div className="d-flex gap-1" style={{ cursor: readOnly ? "default" : "pointer" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readOnly && onChange(star)}
          style={{ fontSize: "20px", color: star <= rating ? "#ffc107" : "#e4e5e9" }}
        >
          ★
        </span>
      ))}
    </div>
  );

  if (loading) return <p className="text-center mt-5">Loading orders...</p>;

  if (orders.length === 0)
    return (
      <div className="text-center mt-5 text-muted">
        <p className="fs-5">No orders yet.</p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/2910/2910763.png"
          alt="No Orders"
          className="w-25 opacity-50"
        />
      </div>
    );

  return (
    <div className="container my-5">
      <h3 className="text-success mb-4 text-center">📦 Your Orders</h3>
      <div className="row g-4">
        {orders.map((order) => {
          const submitted = reviews[order._id];
          const input = reviewInputs[order._id] || { rating: 0, comment: "" };

          const isDelivered = order.status === "Delivered";
          const isCancelled = order.status === "Cancelled";

          return (
            <div key={order._id} className="col-12 col-md-6 col-lg-4">
              <div className={`card h-100 shadow border-0 ${isCancelled ? "bg-light" : ""}`}>
                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                  <span>Order ID: {order._id.slice(-6)}</span>
                  <span
                    className={`badge ${
                      isDelivered
                        ? "bg-light text-success"
                        : isCancelled
                        ? "bg-danger"
                        : "bg-warning text-dark"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="card-body">
                  <p><strong>Address:</strong> {order.address}</p>
                  <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {isDelivered ? (
                      <span className="text-success fw-bold">Delivered ✅</span>
                    ) : isCancelled ? (
                      <span className="text-danger fw-bold">Cancelled ❌</span>
                    ) : (
                      <span className="text-warning fw-bold">On the way 🚚</span>
                    )}
                  </p>

                  <p><strong>Items:</strong></p>
                  <ul className="list-group list-group-flush mb-2">
                    {order.items.map((item) => (
                      <li
                        key={item._id}
                        className="list-group-item d-flex justify-content-between align-items-center px-0"
                      >
                        {item.productId ? item.productId.productName : "Product removed"}
                        <span>
                          {item.quantity} × ₹{item.pricePerKg} = ₹
                          {item.quantity * item.pricePerKg}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {isDelivered && (
                    <div>
                      {submitted ? (
                        <>
                          <p className="mb-1"><strong>Rating:</strong></p>
                          <StarRating rating={submitted.rating} readOnly />
                          <p className="mt-1"><strong>Review:</strong> {submitted.comment}</p>
                        </>
                      ) : (
                        <div className="d-flex flex-column gap-2">
                          <p className="mb-1"><strong>Your Review:</strong></p>
                          <StarRating
                            rating={input.rating || 0}
                            onChange={(value) => handleReviewChange(order._id, "rating", value)}
                          />
                          <textarea
                            placeholder="Write your review..."
                            value={input.comment || ""}
                            onChange={(e) =>
                              handleReviewChange(order._id, "comment", e.target.value)
                            }
                            className="form-control"
                          />
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => submitReview(order)}
                          >
                            Submit Review
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {isCancelled && (
                    <div className="alert alert-danger mt-3" role="alert">
                      <p className="fw-bold mb-1">❌ This order has been cancelled.</p>
                      {order.cancelReason ? (
                        <p className="mb-0">
                          <strong>Reason:</strong> {order.cancelReason}
                        </p>
                      ) : (
                        <p className="mb-0 text-muted fst-italic">No reason provided.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerOrders;
