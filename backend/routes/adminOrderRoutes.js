import express from "express";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";

const router = express.Router();

const protectAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// GET all orders for admin
router.get("/", protectAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customerId", "name email mobile")
      .populate(
        "items.productId",
        "productName pricePerKg quantitySold farmerName farmerMobile"
      ); // ✅ include farmer info

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching orders" });
  }
});

// Mark order as delivered and update quantitySold
router.patch("/:orderId/deliver", protectAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate(
      "items.productId"
    );
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Delivered") {
      return res.status(400).json({ message: "Order is already delivered" });
    }

    // Update quantitySold
    for (let item of order.items) {
      const product = item.productId;
      if (product) {
        product.quantitySold = (product.quantitySold || 0) + item.quantity;
        await product.save();
      }
    }

    order.status = "Delivered";
    await order.save();

    res.json({
      message: "Order marked as delivered and product quantities updated",
      status: order.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

//  Cancel order with reason
router.patch("/:orderId/cancel", protectAdmin, async (req, res) => {
  try {
    const { cancelReason } = req.body; // reason entered by admin

    if (!cancelReason || !cancelReason.trim()) {
      return res.status(400).json({ message: "Cancel reason is required" });
    }

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Delivered") {
      return res.status(400).json({ message: "Delivered orders cannot be cancelled" });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    order.status = "Cancelled";
    order.cancelReason = cancelReason; // ✅ store reason
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      status: order.status,
      cancelReason: order.cancelReason,
    });
  } catch (err) {
    console.error("❌ Failed to cancel order:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});


export default router;
