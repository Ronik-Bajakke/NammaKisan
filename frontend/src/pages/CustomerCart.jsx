import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const CustomerCart = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("customerToken");
        const res = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(res.data.items || []);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };
    fetchCart();
  }, []);

  
  useEffect(() => {
    const newTotal = cart.reduce(
      (acc, item) => acc + item.productId.pricePerKg * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  const handleRemove = async (productId) => {
    try {
      const token = localStorage.getItem("customerToken");
      await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart((prevCart) =>
        prevCart.filter((item) => item.productId._id !== productId)
      );
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleIncrease = async (productId) => {
    try {
      const token = localStorage.getItem("customerToken");
      const res = await axios.put(
        `http://localhost:5000/api/cart/update/${productId}`,
        { action: "increase" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.items || []);
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  const handleDecrease = async (productId) => {
    try {
      const token = localStorage.getItem("customerToken");
      const res = await axios.put(
        `http://localhost:5000/api/cart/update/${productId}`,
        { action: "decrease" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(res.data.items || []);
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  };

  const handleProceed = () => {
    navigate("/customer/checkout", { state: { totalAmount: total } });
  };

  return (
    <div className="container my-5">
      <h3 className="text-success mb-4 text-center">🛒 Your Cart</h3>

      {cart.length > 0 ? (
        <>
         
          <div className="row g-3 justify-content-center">
            {cart.map((item) => (
              <div className="col-12 col-md-6 col-lg-4" key={item.productId._id}>
                <div className="card shadow-sm p-3 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="text-primary">{item.productId.productName}</h5>
                    <p className="text-muted mb-1">
                      <strong>Category:</strong> {item.productId.category}
                    </p>
                    <p className="mb-1">Price: ₹{item.productId.pricePerKg}/kg</p>
                  </div>

                  <div className="d-flex align-items-center justify-content-between my-2">
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleDecrease(item.productId._id)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="mx-2 fw-bold">{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => handleIncrease(item.productId._id)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => handleRemove(item.productId._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          
          <div className="mt-4 p-4 bg-light shadow-sm rounded text-center">
            <h5 className="mb-3">Calculation:</h5>
            <div className="d-flex flex-column align-items-center">
              {cart.map((item) => {
                const itemTotal = item.quantity * item.productId.pricePerKg;
                return (
                  <div key={item.productId._id} className="mb-1" style={{ fontSize: "1rem" }}>
                    {item.quantity} × {item.productId.pricePerKg} = {itemTotal} ({item.productId.productName})
                  </div>
                );
              })}
            </div>

            <hr className="my-3 w-75" />
            <h4>Total Payable: <span className="text-success">₹{total}</span></h4>
            <button className="btn btn-success mt-3" onClick={handleProceed}>
              Proceed
            </button>
          </div>
        </>
      ) : (
        <p className="text-muted text-center">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CustomerCart;
