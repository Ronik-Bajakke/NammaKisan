import express from "express";
import Product from "../models/Product.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { farmerMobile, farmerPassword } = req.body;

  if (!farmerMobile || !farmerPassword) {
    return res.status(400).json({ message: "Mobile number and password are required" });
  }

  try {
    const farmer = await Product.findOne({ farmerMobile });

    if (!farmer) {
      return res.status(401).json({ message: "Invalid mobile number or password" });
    }

    // Compare password exactly
    if (farmer.farmerPassword !== farmerPassword) {
      return res.status(401).json({ message: "Invalid mobile number or password" });
    }

    const token = jwt.sign(
      { id: farmer._id, role: "farmer" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      farmer: {
        id: farmer._id,
        farmerName: farmer.farmerName,
        farmerMobile: farmer.farmerMobile,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
