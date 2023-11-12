// bakery item router

import express from "express";
import {
  createBakeryItem,
  deleteBakeryItem,
  getBakeryItem,
  getBakeryItems,
  updateBakeryItem,
} from "../controllers/bakeryItemController.js";

const bakeryItemRouter = express.Router();

bakeryItemRouter.get("/", getBakeryItems);

bakeryItemRouter.get("/:id", getBakeryItem);

bakeryItemRouter.put("/:id", updateBakeryItem);

bakeryItemRouter.delete("/:id", deleteBakeryItem);

bakeryItemRouter.post("/", createBakeryItem);

export default bakeryItemRouter;
