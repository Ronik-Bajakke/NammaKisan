import express from "express";
import Review from "../models/Review.js";
import Order from "../models/Order.js";
import { protectCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", protectCustomer, async (req, res) => {
  try {
    const { orderId, productId, rating, comment } = req.body;
    const customerId = req.customer._id;
    const customerName = req.customer.name;

    
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.customerId.toString() !== customerId.toString())
      return res.status(403).json({ message: "Cannot review someone else's order" });
    if (order.status !== "Delivered")
      return res.status(400).json({ message: "Cannot review before delivery" });

    
    const existing = await Review.findOne({ orderId, productId, customerId });
    if (existing) return res.status(400).json({ message: "Review already exists" });

    const review = await Review.create({ orderId, productId, customerId, customerName, rating, comment });
    res.status(201).json(review);
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Failed to add review" });
  }
});

router.get("/", protectCustomer, async (req, res) => {
  try {
    const { orderId, productId } = req.query;
    const review = await Review.findOne({ orderId, productId, customerId: req.customer._id });
    res.json(review || null);
  } catch (err) {
    console.error("Fetch review error:", err);
    res.status(500).json({ message: "Failed to fetch review" });
  }
});

export default router;
