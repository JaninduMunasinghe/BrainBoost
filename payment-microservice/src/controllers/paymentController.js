import asyncHandler from "express-async-handler";
import {
  createStripeCheckoutSession,
  handleStripeWebhookEvent,
  handleCreateProduct,
} from "../services/stripeService.js";

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { courseId, amount } = req.body;

  try {
    const sessionId = await createStripeCheckoutSession(courseId, amount);
    res.json({ sessionId });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create checkout session" });
  }
});

export const handleWebhookEvent = asyncHandler(async (req, res) => {
  const event = req.body;

  try {
    await handleStripeWebhookEvent(event);
    res.json({ received: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Webhook handling error" });
  }
});

// controller to create a stripe product using create product service
// args - name, description, price

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const response = await handleCreateProduct(name, description, price);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to create product" });
  }
});
