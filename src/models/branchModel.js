// creating branch model

import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    branch_id: {
      type: Number,
      required: true,
    },
    branch_name: {
      type: String,
      required: true,
    },
    branch_location: {
      type: String,
      required: true,
    },
    branch_phone: {
      type: String,
      required: true,
    },
    branch_address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const branchModel = mongoose.model("Branch", branchSchema);

export default branchModel;
