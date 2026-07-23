const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    sendMessage,
    fetchMessages,
} = require("../controllers/messageController");

router.post("/", protect, sendMessage);

router.get("/:chatId", protect, fetchMessages);

module.exports = router;