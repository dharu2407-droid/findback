
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(express.json());

// =========================
// FRONTEND
// =========================

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// =========================
// API ROUTES
// =========================

app.get("/api", (req, res) => {
  res.json({
    message: "FindBack API is running!"
  });
});

app.get("/test", (req, res) => {
  res.json({
    message: "Test route working!"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);

// =========================
// DATABASE
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );
  });

// =========================
// VERCEL EXPORT
// =========================

module.exports = app;

// =========================
// LOCAL DEVELOPMENT
// =========================

if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

