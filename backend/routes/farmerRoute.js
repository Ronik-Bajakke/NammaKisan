import express from "express";
import { protectFarmer } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

// Get farmer profile
router.get("/profile", protectFarmer, async (req, res) => {
  try {
    res.json(req.farmer); 
  } catch (error) {
    console.error("Failed to fetch farmer profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/dashboard", protectFarmer, async (req, res) => {
  try {
    const farmerMobile = req.farmer.farmerMobile;

   
    const products = await Product.find({ farmerMobile }).sort({ createdAt: -1 });

    
    const productsWithRemaining = products.map((product) => ({
      _id: product._id,
      farmerName: product.farmerName,
      productName: product.productName,
      productImage: product.productImage,
      farmerMobile: product.farmerMobile,
      quantity: product.quantity,
      minBuy: product.minBuy,
      category: product.category,
      address: product.address,
      pricePerKg: product.pricePerKg,
      quantitySold: product.quantitySold || 0,
      remaining: product.quantity - (product.quantitySold || 0),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    res.json(productsWithRemaining);
  } catch (error) {
    console.error("Failed to fetch farmer products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
