import express from "express";
import {
  createCheckoutSession,
  createProduct,
  handleWebhookEvent,
} from "./controllers/paymentController.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/webhook", handleWebhookEvent);
router.post("/create-product", createProduct);

export default router;
