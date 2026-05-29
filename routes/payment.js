const express = require('express');
const Razorpay = require('razorpay');
const { sendZip } = require("../services/mailer");
const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


router.post('/create-order', async (req, res) => {

    try {

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: "receipt_order"
        };

        const order = await razorpay.orders.create(options);

        res.json(order);

    } catch (error) {

        console.error("Order creation error:", error);

        res.status(500).json({
            success: false,
            error: "Order creation failed"
        });

    }

});


router.post('/verify-payment', async (req, res) => {
    try {

        console.log("✅ Payment verified");

        console.log(req.body);
const { email } = req.body;

if (email) {
    await sendZip(email);
}
        res.json({
            success: true,
            message: "Payment verified successfully"
        });

    } catch (error) {

        console.error("Verification error:", error);

        res.status(500).json({
            success: false,
            error: "Verification failed"
        });

    }

});

module.exports = router;