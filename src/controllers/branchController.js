// branches controller

import { HttpStatus, Response } from "../helpers/Response.js";
import branchModel from "../models/branchModel.js";

export const getBranches = async (req, res) => {
  try {
    const branches = await branchModel.find({});
    console.log("length", branches.length);
    return res
      .status(HttpStatus.ALREADY_EXISTS.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          branches
        )
      );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
