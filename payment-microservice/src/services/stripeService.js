import stripe from "stripe";
import dotenv from "dotenv";
import { getAPIUrl } from "../utils/getAPIUrl.js";
dotenv.config();

// import { sendAPIRequest } from './externalService.js';
// import { savePayment } from './paymentService.js';

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeCheckoutSession = async (courseId, amount) => {
  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        course_id: "courseId",
        amount: "amount",
      },
      line_items: [
        {
          price: courseId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/payments/success",
      cancel_url: "http://localhost:3000/payments/cancelled",
    });

    return session.id;
  } catch (error) {
    throw new Error("Failed to create checkout session");
  }
};

export const handleStripeWebhookEvent = async (event) => {
  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        // update enrolment
        // await savePayment(event); // save payment details to db
        console.log("Payment succeeded", event);

        break;
      case "payment_intent.payment_failed":
        const paymentFailure = event.data.object;
        console.log("Payment failed", event);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    throw new Error("Error handling webhook event");
  }
};

// create a product service
export const handleCreateProduct = async (name, description, price) => {
  try {
    const product = await stripeClient.products.create({
      name,
      description,
    });

    const priceObj = await stripeClient.prices.create({
      product: product.id,
      unit_amount: price * 100,
      currency: "usd",
    });

    return { product, price: priceObj };
  } catch (error) {
    throw new Error("Failed to create product");
  }
};

// create enrolment
const handleCreateEnrolment = async (courseId, learnerId) => {
  try {
    const response = await fetch(
      `http://${getAPIUrl()}:${
        process.env.LEARNER_PORT
      }/api/learner/${learnerId}/course/${courseId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.json();
  } catch (error) {
    throw new Error("Failed to create enrolment");
  }
};

// http://localhost:4002/api/learner/663af92d9d88c926ab1ccd05/course/${courseId}
