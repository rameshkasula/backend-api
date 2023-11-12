// bakery item model

import mongoose from "mongoose";

const bakeryItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const bakeryItemModel = mongoose.model("BakeryItem", bakeryItemSchema);

export default bakeryItemModel;
