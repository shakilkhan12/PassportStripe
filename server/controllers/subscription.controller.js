const stripe = require("stripe")(process.env.STRIPE_SECRET);
class Subscripiton {
  async getSubscriptions(req, res) {
    try {
      const plans = await stripe.prices.list({ active: true });
      const subscriptions = await stripe.subscriptions.list({
        // limit: 3,
      });
      plans.data.forEach(async (item) => {
        const product = await stripe.products.retrieve(item.product);
        // console.log("Product: ", product);
      });
      const subscription = await stripe.subscriptions.retrieve(
        "sub_1P9Mc7PuGOemXa6ZWNcxhEJg"
      );
      res.json({ plans: plans.data, subscriptions, subscription });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve plans" });
    }
  }
  async webhook(request, response) {
    console.log("its running webhook");
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      // console.log("EVENT -> ", event);
      console.log("current user -> ", event);
      if (event?.data?.object?.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          event.data.object.subscription
        );
      }

      // console.log("SUBSCRIPTION DETAILS -> ", subscription);
    } catch (err) {
      console.log("Error -> ", err.message);
      response.status(400).send(`Webhook Error: ${err.meszssage}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
}
module.exports = new Subscripiton();
