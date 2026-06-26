const express = require("express");
const { Cashfree, CFEnvironment } = require("cashfree-pg");
const { sendManifestEmail } = require("../services/mailer");

const router = express.Router();

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);

router.post("/create-order", async (req, res) => {
  try {
    const email = req.body.email;
    const amount = Number(req.body.amount) || 599;

    const orderId = `order_${Date.now()}`;

    const orderRequest = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_email: email,
        customer_phone: "9999999999"
      },
      order_meta: {
return_url: "https://manifest-money.vercel.app/payment-status.html?order_id={order_id}"},
    };

    const response = await cashfree.PGCreateOrder(orderRequest);
console.log("CASHFREE RESPONSE:");
console.log(JSON.stringify(response.data, null, 2));
console.log("PAYMENT LINK =", response.data.payment_link);
console.log("PAYMENT SESSION =", response.data.payment_session_id);

  return res.json({
  success: true,
  order_id: orderId,
  payment_session_id: response.data.payment_session_id
});
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

router.post("/payment-success", async (req, res) => {
  try {
    const { email } = req.body;

    await sendManifestEmail(email);

    return res.json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {

    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({
        paid: false,
        message: "order_id missing"
      });
    }

    const response = await cashfree.PGFetchOrder(order_id);

    const status = response?.data?.order_status;

    console.log("Order Status:", status);

    if (
      status === "PAID" ||
      status === "SUCCESS"
    ) {
      return res.json({
        paid: true
      });
    }

    return res.json({
      paid: false,
      status
    });

  } catch (err) {

    console.error("VERIFY ERROR:", err);

    return res.status(500).json({
      paid: false,
      error: err.message
    });

  }
});

module.exports = router;