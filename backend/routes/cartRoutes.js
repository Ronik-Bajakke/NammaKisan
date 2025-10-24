import express from "express";
import Cart from "../models/Cart.js";
import { protectCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

//  cart for logged-in customer
router.get("/", protectCustomer, async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.customer.id }).populate("items.productId");
    res.json(cart || { items: [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

// Add item to cart
router.post("/add", protectCustomer, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ customerId: req.customer.id });

    if (!cart) {
      cart = new Cart({ customerId: req.customer.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.productId");

    res.json({ items: updatedCart.items });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

// Remove item from cart
router.delete("/remove/:productId", protectCustomer, async (req, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ customerId: req.customer.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.productId");

    res.json({ items: updatedCart.items });
  } catch (error) {
    console.error("Error removing item:", error);
    res.status(500).json({ message: "Failed to remove item" });
  }
});

// Update quantity (+ / −)
router.put("/update/:productId", protectCustomer, async (req, res) => {
  try {
    const { action } = req.body; // "increase" or "decrease"
    const { productId } = req.params;

    const cart = await Cart.findOne({ customerId: req.customer.id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) return res.status(404).json({ message: "Item not found" });

    if (action === "increase") item.quantity += 1;
    if (action === "decrease" && item.quantity > 1) item.quantity -= 1;

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate("items.productId");

    res.json({ items: updatedCart.items });
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Failed to update quantity" });
  }
});

// Clear entire cart (needed for checkout)
router.delete("/clear", protectCustomer, async (req, res) => {
  try {
    const cart = await Cart.findOne({ customerId: req.customer.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
});

export default router;
