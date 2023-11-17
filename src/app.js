import express from "express";
import Cors from "cors";
import http from "http";
import dotenv from "dotenv";
// import { generateBranches, generateOrders } from "./helpers/sampleData.js";
import { connectDB } from "./helpers/db.js";
import appRouter from "./routes/index.js";
import { randomBranchId } from "./helpers/constants.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(Cors());
app.use(express.json());

// function to insert data
async function bulkWriteBranches(branches) {
  try {
    console.log("Inserting branch data", branches.length);
    //   await branchModel.bulkWrite(branches);
    // await branchModel.insertMany(branches);
    console.log(" branch Data inserted");
  } catch (error) {
    console.error("Error  inserting branch data:", error);
  }
}

// function to insert data
async function bulkWriteOrders(orders) {
  try {
    console.log("Inserting  orders data", orders.length);
    // await orderModel.insertMany(orders);
    console.log("orders Data inserted");
  } catch (error) {
    console.error("Error inserting order data:", error);
  }
}

// routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", appRouter);

const result = randomBranchId();
console.log(result, "result");
// server
async function startServer() {
  try {
    await connectDB();
    console.log("Database connected");

    // const branches = generateBranches(1000);
    // await bulkWriteBranches(branches);

    // const orders = generateOrders(100000);
    // await bulkWriteOrders(orders);

    http.createServer(app).listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Server is running on port http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
