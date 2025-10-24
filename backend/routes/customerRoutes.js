import express from "express";
import Customer from "../models/Customer.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { protectCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await customer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: customer._id, role: "customer" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//  Customer Signup
router.post("/signup", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const customer = await Customer.create({ name, email, mobile, password });

    const token = jwt.sign({ id: customer._id, role: "customer" }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Customer Profile
router.get("/profile", protectCustomer, async (req, res) => {
  try {
    const customer = req.customer;
    res.json({
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      mobile: customer.mobile,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
