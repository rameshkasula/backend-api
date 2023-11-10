// orders model

import mongoose from "mongoose";
import { bakeryItems, orderStatus } from "../helpers/constants.js";

const orderSchema = new mongoose.Schema(
  {
    order_id: { type: Number, required: true },
    item_type: {
      type: String,
      required: true,
      enum: bakeryItems,
    },
    order_state: {
      type: String,
      required: true,
      enum: orderStatus,
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
