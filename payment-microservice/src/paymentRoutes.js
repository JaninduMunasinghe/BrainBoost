import express from 'express';
import { createCheckoutSession, handleWebhookEvent } from './controllers/paymentController.js';

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/webhook', handleWebhookEvent);

export default router;
