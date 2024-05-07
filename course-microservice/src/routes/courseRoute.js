import express from "express";

import multer from "multer";
import {
  createCourse,
  getCourses,
  getCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/courseController.js";
import { upload } from "../utils/fileUpload.js";
const router = express.Router();

router.post("/", upload.single("video"), createCourse);
router.get("/", getCourses);
router.get("/:id", getCourse);
router.delete("/:id", deleteCourse);
router.patch("/:id", upload.single("image"), updateCourse);

export default router;
