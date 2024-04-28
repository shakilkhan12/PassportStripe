const express = require("express");
const subscriptionController = require("../controllers/subscription.controller");
const auth = require("../middleware");
const router = express.Router();
router.get("/api/get-subscriptions", subscriptionController.getSubscriptions);
router.post(
  "/api/webhook",
  [express.raw({ type: "application/json" }), auth],
  subscriptionController.webhook
);
router.get("/api/testing", (req, res) => {
  res.send("hello msg");
});
module.exports = router;
