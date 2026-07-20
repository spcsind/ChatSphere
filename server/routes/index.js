const express = require("express");

const router = express.Router();

// Root Route
router.get("/", (req, res) => {
    res.send("Welcome to ChatSphere API 🚀");
});

module.exports = router;