// app router
import express from "express";

import branchRouter from "./branchRouter.js";
import orderRouter from "./orderRouter.js";
import bakeryItemRouter from "./bakeryItemRouter.js";

const appRouter = express.Router();

appRouter.use("/branch", branchRouter);
appRouter.use("/orders", orderRouter);
appRouter.use("/items", bakeryItemRouter);

// no route
appRouter.use("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "Route not found",
  });
});

export default appRouter;
