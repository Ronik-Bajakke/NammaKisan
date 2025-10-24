import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminSales = () => {
  const [sales, setSales] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/sales", {
          headers: { Authorization: `Bearer ${token}` },
        });

        
        const sortedOrders = res.data.recentOrders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setSales({ ...res.data, recentOrders: sortedOrders });
      } catch (err) {
        console.error("Failed to fetch sales:", err);
      }
    };
    fetchSales();
  }, [token]);

  if (!sales) return <p className="text-center mt-5">Loading sales...</p>;

  const totalOrders = sales.recentOrders.length;

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-success fw-bold">
        <i className="fa fa-chart-line me-2"></i>Sales Dashboard
      </h3>

      
      <div className="row mb-4">
        {[
          { title: "Today", value: sales.today },
          { title: "This Month", value: sales.month },
          { title: "This Year", value: sales.year },
          { title: "All Time", value: sales.allTime }
        ].map((card, idx) => (
          <div className="col-md-3 mb-3" key={idx}>
            <div className="card shadow-sm text-center p-3">
              <h6 className="text-muted">{card.title}</h6>
              <h4 className="text-success fw-bold">₹{card.value.toLocaleString()}</h4>
            </div>
          </div>
        ))}
      </div>

      
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-success">
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Address</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.recentOrders.map((order, idx) => (
              <tr key={order._id}>
                
                <td>{totalOrders - idx}</td>
                <td>{order.customerId?.name || order.customerId}</td>
                <td>
                  {order.items
                    .map(
                      (i) =>
                        `${i.productId?.productName || i.productId} (${i.quantity}kg)`
                    )
                    .join(", ")}
                </td>
                <td>₹{order.totalAmount.toLocaleString()}</td>
                <td>{order.address}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSales;
