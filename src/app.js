import express from "express";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import { generateBranches } from "./helpers/sampleData.js";
import { connectDB } from "./helpers/db.js";
import appRouter from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Move this function to a separate file if it grows
function freqNumbers(nums) {
  let freq = {};

  for (const num of nums) {
    if (freq[num]) {
      freq[num.branch_id]++;
    } else {
      freq[num.branch_id] = 1;
    }
  }
  return freq;
}

// Move this function to a separate file if it grows
async function bulkWriteBranches(branches) {
  try {
    console.log("Inserting data", branches.length);
    //   await branchModel.bulkWrite(branches);
    // await branchModel.insertMany(branches);
    console.log("Data inserted");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

// routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", appRouter);

// Move this function to a separate file if it grows
async function startServer() {
  try {
    await connectDB();
    console.log("Database connected");

    const branches = generateBranches(1000);
    await bulkWriteBranches(branches);

    http.createServer(app).listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Server is running on port http://localhost:${PORT}/`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
