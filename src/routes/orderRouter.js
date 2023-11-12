import express from "express";
import {
  getOrderCountsAndSalesByItems,
  getOrders,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/", getOrders);

orderRouter.get("/itemwise", getOrderCountsAndSalesByItems);

export default orderRouter;
