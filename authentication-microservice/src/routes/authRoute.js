import express from "express";

import {
  getLearnerById,
  login,
  register,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/user/:id", getLearnerById);

export default router;
