// bakery item controller

import { HttpStatus, Response } from "../helpers/Response.js";
import bakeryItemModel from "../models/bakeryItemModel.js";

export const getBakeryItems = async (req, res) => {
  try {
    const items = await bakeryItemModel.find({});
    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          items
        )
      );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getBakeryItem = async (req, res) => {
  try {
    const item = await bakeryItemModel.findById(req.params.id);
    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          item
        )
      );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createBakeryItem = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const item = await bakeryItemModel.create(req.body);

    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          item
        )
      );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateBakeryItem = async (req, res) => {
  try {
    const item = await bakeryItemModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          item
        )
      );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteBakeryItem = async (req, res) => {
  try {
    const item = await BakeryItemModel.findByIdAndDelete(req.params.id);
    return res
      .status(HttpStatus.OK.code)
      .json(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          HttpStatus.OK.message,
          item
        )
      );
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
