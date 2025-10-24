import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";

import adminRoutes from "./routes/adminRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";


import farmerAuthRoutes from "./routes/farmerAuthRoute.js";
import farmerRoutes from "./routes/farmerRoute.js";


import adminOrderRoutes from "./routes/adminOrderRoutes.js";



const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);



app.use("/api/farmer", farmerAuthRoutes); 
app.use("/api/farmer", farmerRoutes);    
app.use("/api/customer", customerRoutes);


app.use("/api/admin/orders", adminOrderRoutes);


// Configur Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("✅ Cloudinary configured successfully");

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
};
connectDB();

app.get("/", (req, res) => {
  res.send("🌾 NammaKisan backend is running!");
});

app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
