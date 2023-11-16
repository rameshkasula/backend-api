// branches controller

import { HttpStatus, Response } from "../helpers/Response.js";
import branchModel from "../models/branchModel.js";

export const getBranches = async (req, res) => {
  try {
    // with pagination
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 items per page

    // Calculate the number of documents to skip based on the page and pageSize
    const skip = (page - 1) * pageSize;

    const branches = await branchModel.find().skip(skip).limit(pageSize);
    console.log("length", branches.length);
    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          branches
        )
      );
  } catch (error) {
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .json(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          HttpStatus.INTERNAL_SERVER_ERROR.message,
          error
        )
      );
  }
};
