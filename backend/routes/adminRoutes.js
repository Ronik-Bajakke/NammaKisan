import express from "express";
import jwt from "jsonwebtoken";
import Product from "../models/Product.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

import Customer from "../models/Customer.js";
import Order from "../models/Order.js";

const router = express.Router();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

const streamUpload = (fileBuffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products", allowed_formats: ["jpg", "jpeg", "png"] },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });


// Admin Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    !process.env.ADMIN_EMAIL ||
    !process.env.ADMIN_PASSWORD ||
    !process.env.JWT_SECRET
  ) {
    return res
      .status(500)
      .json({ message: "Admin credentials or JWT secret missing in .env" });
  }

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});


// Verify Token
router.get("/verify", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    res.json({ message: "Token valid" });
  } catch (err) {
    res.status(401).json({ message: "Token invalid or expired" });
  }
});


// Add Product 
router.post("/add-product", upload.single("productImage"), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const {
      farmerName,
      productName,
      farmerMobile,
      quantity,
      minBuy,
      category,
      address,
      pricePerKg,
    } = req.body;

    
    if (
      !farmerName ||
      !productName ||
      !farmerMobile ||
      !quantity ||
      !minBuy ||
      !category ||
      !address ||
      !pricePerKg
    ) {
      return res.status(400).json({
        message: "All fields (including pricePerKg) are required.",
      });
    }

    if (!req.file)
      return res.status(400).json({ message: "Product image is required" });

    
    const parsedQuantity = parseFloat(quantity);
    const parsedMinBuy = parseFloat(minBuy);
    const parsedPrice = parseFloat(pricePerKg);

    if (isNaN(parsedQuantity) || isNaN(parsedMinBuy) || isNaN(parsedPrice)) {
      return res.status(400).json({
        message: "Quantity, Min Buy, and Price Per Kg must be numbers.",
      });
    }

    
    const result = await streamUpload(req.file.buffer);

    const product = new Product({
      farmerName,
      productName,
      productImage: result.secure_url,
      farmerMobile,
      quantity: parsedQuantity,
      minBuy: parsedMinBuy,
      category,
      address,
      pricePerKg: parsedPrice,
    });

    await product.save();
    res.status(201).json({ message: "✅ Product added successfully", product });
  } catch (err) {
    console.error("❌ Error adding product:", err);
    res.status(500).json({ message: "Server error" });
  }
});
-
// Get All Products

router.get("/products", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("❌ Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Search Products
router.get("/products/search", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const query = req.query.q || "";
    if (!query) return res.json([]);

    const regex = new RegExp(query, "i"); 
    const products = await Product.find({
      $or: [
        { productName: regex },
        { farmerName: regex },
        { category: regex },
        { farmerMobile: regex },
         { address: regex },
      ],
    }).sort({ createdAt: -1 });

    res.json(products);
  } catch (err) {
    console.error("❌ Search error:", err);
    res.status(500).json({ message: "Failed to fetch search results." });
  }
});


// Get single product by ID
router.get("/products/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    console.error("❌ Error fetching single product:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// router.get("/products/:id", async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "No token provided" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role !== "admin")
//       return res.status(403).json({ message: "Forbidden" });

//     const product = await Product.findById(req.params.id);
//     if (!product)
//       return res.status(404).json({ message: "Product not found" });

//     res.json(product);
//   } catch (err) {
//     console.error("❌ Error fetching single product:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


router.put(
  "/products/:id",
  upload.single("productImage"), // optional new image
  async (req, res) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "No token provided" });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== "admin")
        return res.status(403).json({ message: "Forbidden" });

      const {
        farmerName,
        productName,
        farmerMobile,
        quantity,
        minBuy,
        category,
        address,
        pricePerKg,
      } = req.body;

      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Product not found" });

      
      product.farmerName = farmerName || product.farmerName;
      product.productName = productName || product.productName;
      product.farmerMobile = farmerMobile || product.farmerMobile;
      product.quantity = quantity ? parseFloat(quantity) : product.quantity;
      product.minBuy = minBuy ? parseFloat(minBuy) : product.minBuy;
      product.category = category || product.category;
      product.address = address || product.address;
      product.pricePerKg = pricePerKg ? parseFloat(pricePerKg) : product.pricePerKg;

    
      if (req.file) {
        const result = await streamUpload(req.file.buffer);
        product.productImage = result.secure_url;
      }

      await product.save();
      res.json({ message: "✅ Product updated successfully", product });
    } catch (err) {
      console.error("❌ Error updating product:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// Soft Delete Product by ID
router.delete("/products/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.isDeleted = true; // ✅ Soft delete
    await product.save();

    res.json({ message: "✅ Product soft-deleted successfully" });
  } catch (err) {
    console.error("❌ Error soft-deleting product:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/customers", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Forbidden: Not an admin" });

   
    const customers = await Customer.find().sort({ createdAt: -1 });

    
    const customersWithOrders = await Promise.all(
      customers.map(async (cust) => {
        const orderCount = await Order.countDocuments({ customerId: cust._id });
        return {
          _id: cust._id,
          name: cust.name,
          email: cust.email,
          mobile: cust.mobile,
          orderCount,
        };
      })
    );

    res.json(customersWithOrders);
  } catch (err) {
    console.error("❌ Error fetching customers:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get All Farmers with Summary
router.get("/farmers", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Forbidden: Not an admin" });

  
    const products = await Product.find();

    
    const farmersMap = {};

    products.forEach((p) => {
      if (!farmersMap[p.farmerMobile]) {
        farmersMap[p.farmerMobile] = {
          farmerName: p.farmerName,
          farmerMobile: p.farmerMobile,
          address: p.address,
          totalProducts: 0,
          soldOut: 0,
          active: 0,
          totalEarnings: 0,
          listings: [],
        };
      }

      const remaining = p.quantity - (p.quantitySold || 0);
      const totalSale = (p.quantitySold || 0) * p.pricePerKg;

      farmersMap[p.farmerMobile].totalProducts++;
      farmersMap[p.farmerMobile].totalEarnings += totalSale;
      if (remaining > 0) farmersMap[p.farmerMobile].active++;
      else farmersMap[p.farmerMobile].soldOut++;
      farmersMap[p.farmerMobile].listings.push(p);
    });

    const farmers = Object.values(farmersMap);
    res.json(farmers);
  } catch (err) {
    console.error("❌ Error fetching farmers:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// Get Sales Summary

router.get("/sales", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

   
    const deliveredOrders = await Order.find({ status: "Delivered" }).populate("customerId").populate("items.productId");

    const sumSales = (orders) => orders.reduce((acc, o) => acc + o.totalAmount, 0);

    const todaySales = sumSales(deliveredOrders.filter(o => o.createdAt >= startOfToday));
    const monthlySales = sumSales(deliveredOrders.filter(o => o.createdAt >= startOfMonth));
    const yearlySales = sumSales(deliveredOrders.filter(o => o.createdAt >= startOfYear));
    const allTimeSales = sumSales(deliveredOrders);

    res.json({
      today: todaySales,
      month: monthlySales,
      year: yearlySales,
      allTime: allTimeSales,
      recentOrders: deliveredOrders.sort((a, b) => b.createdAt - a.createdAt) // ✅ all orders, most recent first
    });

  } catch (err) {
    console.error("❌ Error fetching sales:", err);
    res.status(500).json({ message: "Server error" });
  }
});






export default router;
