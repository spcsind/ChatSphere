const express = require("express");

const app = express();

// Import Routes
const indexRoutes = require("./routes");
const authRoutes = require("./routes/authRoutes");

// Middleware
app.use(express.json());

// Routes
app.use("/", indexRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;