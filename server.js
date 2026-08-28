
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");

const app = express();

app.use(cors());

// Disable CSP for our local development frontend
app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(express.json());


// Frontend
app.use(express.static("public"));


// Uploaded images
app.use(
  "/uploads",
  express.static("uploads")
);


// API
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


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);


// Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {

      console.log(
        `Server running on port ${PORT}`
      );

    });

  })

  .catch((error) => {

    console.error(
      "MongoDB connection failed:",
      error.message
    );

  });

