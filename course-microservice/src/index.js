import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { connectDB } from "../configs/DBConnect.js";

config();

export const courseService = express();

courseService.use(cookieParser());
courseService.use(cors());

courseService.use(express.json());

const port = process.env.COURSE_PORT;

// Start the server after connecting to the database
connectDB()
  .then(() => {
    courseService.listen(port, () => {
      console.log(`Course server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

courseService.get("/", (req, res) => {
  console.log(`Received request to course server from gateway`);
  res.status(200).send("Response from course server");
});
