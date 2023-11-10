// app router

import express from "express";
import branchRouter from "./branchRouter.js";

const appRouter = express.Router();

appRouter.use("/branch", branchRouter);

export default appRouter;
