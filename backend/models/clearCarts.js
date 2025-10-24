import mongoose from "mongoose";
import dotenv from "dotenv";
import Cart from "./Cart.js"; 


dotenv.config({ path: "../.env" }); 

const mongoURI = process.env.MONGO_URL;

if (!mongoURI) {
  console.error("Error: MONGO_URL not found in .env");
  process.exit(1);
}

const clearCarts = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    const result = await Cart.deleteMany({});
    console.log(`Deleted ${result.deletedCount} cart items`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error:", err);
  }
};

clearCarts();
