import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { connectDB } from "../configs/DBConnect.js";

config();

export const learnerService = express();

learnerService.use(cookieParser());
learnerService.use(cors());

learnerService.use(express.json());

const port = process.env.LEARNER_PORT;

// Start the server after connecting to the database
connectDB()
  .then(() => {
    learnerService.listen(port, () => {
      console.log(`Learner server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

learnerService.get("/", (req, res) => {
  console.log(`Received request to learner server from gateway`);
  res.status(200).send("Response from learner server");
});
