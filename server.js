const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const paymentRoutes = require("./routes/payment");

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(
  cors({
    origin: [
      "https://www.divyaura.shop",
      "https://divyaura.shop"
    ]
  })
);

app.use(express.json());


// =========================
// ENV CHECK
// =========================

if (
  !process.env.RAZORPAY_KEY_ID ||
  process.env.RAZORPAY_KEY_ID === "test"
) {
  console.warn("⚠️ RAZORPAY_KEY_ID not properly configured");
}

if (
  !process.env.RAZORPAY_KEY_SECRET ||
  process.env.RAZORPAY_KEY_SECRET === "test"
) {
  console.warn("⚠️ RAZORPAY_KEY_SECRET not properly configured");
}


// =========================
// API ROUTES
// =========================

app.use("/api", paymentRoutes);


// =========================
// HEALTH CHECK
// =========================

app.get("/health", (req, res) => {

  res.json({
    success: true,
    message: "Server running successfully"
  });

});


// =========================
// STATIC FILES
// =========================

app.use(express.static(path.join(__dirname, "Public")));


// =========================
// HOME PAGE
// =========================

app.get("/", (req, res) => {

  res.sendFile(
    path.join(__dirname, "Public", "manifest Money.html")
  );

});


// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {

  console.error("Server error:", err);

  res.status(500).json({

    success: false,

    message: "Internal server error",

    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : undefined

  });

});


// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`✅ Server Running On Port ${PORT}`);

});