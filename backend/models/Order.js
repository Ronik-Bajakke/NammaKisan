import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        pricePerKg: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Delivered", "Cancelled"], default: "Pending" }, 
    cancelReason: { type: String, default: null }, 
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
