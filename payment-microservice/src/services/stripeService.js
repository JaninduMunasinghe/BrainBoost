import stripe from "stripe";
// import { sendAPIRequest } from './externalService.js';
// import { savePayment } from './paymentService.js';

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeCheckoutSession = async (courseId, amount) => {
  try {
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              courseId: courseId,
            },
            unit_amount: amount * 100, // convert amount to cents
          },
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
        // await sendAPIRequest(); // update enrolment
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
