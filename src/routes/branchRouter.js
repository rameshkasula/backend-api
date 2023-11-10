// branch router

import express from "express";
import { getBranches } from "../controllers/branchController.js";

const branchRouter = express.Router();

branchRouter.get("/", getBranches);

export default branchRouter;
