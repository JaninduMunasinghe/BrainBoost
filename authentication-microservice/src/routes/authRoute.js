import express from "express";
import {
  getLearnerById,
  login,
  register,
  isAuthenticated,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/user/:id", getLearnerById);

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("Logged out");
});

router.get("/check-auth", isAuthenticated, (req, res) => {
  res.status(200).send({ isAuthenticated: true });
});

export default router;
