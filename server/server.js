const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to ChatSphere API 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});