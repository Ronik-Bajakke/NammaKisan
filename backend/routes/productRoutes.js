import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const {
      farmerName,
      productName,
      productImage,
      farmerMobile,
      quantity,
      minBuy,
      category,
      address,
      pricePerKg,
    } = req.body;

    if (!farmerMobile) {
      return res.status(400).json({ message: "Farmer mobile is required" });
    }

    
    const existingProduct = await Product.findOne({ farmerMobile });

    
    const farmerPassword = existingProduct
      ? existingProduct.farmerPassword
      : Math.floor(10000000 + Math.random() * 90000000).toString();

    
    const newProduct = new Product({
      farmerName,
      productName,
      productImage,
      farmerMobile,
      quantity,
      minBuy,
      category,
      address,
      pricePerKg,
      farmerPassword,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("❌ Failed to add product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const search = req.query.search?.trim().toLowerCase() || "";
    const category = req.query.category?.trim().toLowerCase() || "";

    const filter = {};

    
    if (search && search !== "all") {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { farmerName: { $regex: search, $options: "i" } },
      ];
    }

    
    if (category && category !== "all") {
      filter.category = { $regex: category, $options: "i" };
    }

    
    const products = await Product.find({
      ...filter,
      $expr: { $gt: ["$quantity", { $ifNull: ["$quantitySold", 0] }] },
    }).sort({ createdAt: -1 }); 
    res.json(products);
  } catch (err) {
    console.error("❌ Failed to fetch products:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("❌ Failed to fetch product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
