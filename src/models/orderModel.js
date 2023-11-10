// orders model

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order_id: { type: String, required: true },
    item_type: {
      type: String,
      required: true,
      enum: ["Cake", "Cookies", "Muffins"],
    },
    order_state: {
      type: String,
      required: true,
      enum: ["Created", "Shipped", "Delivered", "Canceled"],
    },
    last_update_time: { type: Date, default: Date.now },
    branch_id: { type: Number, required: true },
    customer_id: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const orderModel = mongoose.model("Order", orderSchema);

export default orderModel;
