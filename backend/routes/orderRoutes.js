import express from "express";
import axios from "axios";
import Order from "../models/Order.js";
import Product from "../models/Product.js"; // ✅ import Product model
import { protectCustomer } from "../middleware/authMiddleware.js"; // auth middleware

const router = express.Router();


// Place Order 
router.post("/", protectCustomer, async (req, res) => {
  const { address, totalAmount } = req.body;

  try {
    const cartRes = await axios.get(`http://localhost:5000/api/cart`, {
      headers: { Authorization: req.headers.authorization },
    });

    const cartItems = cartRes.data.items;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      pricePerKg: item.productId.pricePerKg,
    }));

    const newOrder = new Order({
      customerId: req.customer.id,
      items: orderItems,
      totalAmount,
      address,
    });

    await newOrder.save();

    
    await axios.delete(`http://localhost:5000/api/cart/clear`, {
      headers: { Authorization: req.headers.authorization },
    });

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (err) {
    console.error("Failed to place order:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.get("/", protectCustomer, async (req, res) => {
  try {
    
    const orders = await Order.find({ customerId: req.customer.id }).populate(
      "items.productId",
      "productName pricePerKg"
    );

   
    const ordersWithCancelReason = orders.map((order) => ({
      _id: order._id,
      customerId: order.customerId,
      items: order.items,
      totalAmount: order.totalAmount,
      address: order.address,
      status: order.status,
      cancelReason: order.cancelReason || null,
      createdAt: order.createdAt,
    }));

    res.json(ordersWithCancelReason);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
