import express from "express";

import {
  enrolLearner,
  unenrolLearner,
} from "../controllers/learnerController.js";

const router = express.Router();

router.post("/:sid/course/:cid", enrolLearner);
router.post("/:sid/unenrol-course/:cid", unenrolLearner);

export default router;
