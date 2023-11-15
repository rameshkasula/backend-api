import express from "express";
import {
  getOrderCountsAndSalesByItems,
  getOrders,
  getTopBranches,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/", getOrders);

orderRouter.get("/itemwise", getOrderCountsAndSalesByItems);

orderRouter.get("/top", getTopBranches);

export default orderRouter;
