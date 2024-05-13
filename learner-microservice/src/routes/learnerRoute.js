import express from "express";

import {
  completeChapter,
  enrolLearner,
  getProgress,
  unenrolLearner,
} from "../controllers/learnerController.js";

const router = express.Router();

router.post("/:sid/course/:cid", enrolLearner);
router.post("/:sid/unenrol-course/:cid", unenrolLearner);
router.post("/course/lecture/complete", completeChapter);
router.get("/:sid/course/:cid/progress", getProgress);

export default router;
