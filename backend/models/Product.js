import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    farmerName: String,
    productName: String,
    productImage: String,
    farmerMobile: String,
    quantity: Number, 
    minBuy: Number,
    category: String,
    address: String,
    pricePerKg: Number,
    farmerPassword: {
      type: String,
      required: true,
    },
    quantitySold: {
      type: Number,
      default: 0, 
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//  farmers with an 8-digit password
productSchema.pre("validate", async function (next) {
  try {
    if (!this.farmerPassword && this.farmerMobile) {
      const existing = await mongoose.model("Product").findOne({
        farmerMobile: this.farmerMobile,
      });

      if (existing && existing.farmerPassword) {
        this.farmerPassword = existing.farmerPassword; 
      } else {
        
        this.farmerPassword = Math.floor(10000000 + Math.random() * 90000000).toString();
      }
    }
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("Product", productSchema);
