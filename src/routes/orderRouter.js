import express from "express";
import {
  getAllItemsOrderCount,
  getOrderCountsAndSalesByItems,
  getOrders,
  getTopBranches,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/", getOrders);

orderRouter.get("/itemwise", getOrderCountsAndSalesByItems);

orderRouter.get("/top", getTopBranches);

orderRouter.get("/sales", getAllItemsOrderCount);

export default orderRouter;
