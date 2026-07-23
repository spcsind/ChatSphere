const { io } = require("socket.io-client");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
    console.log("Connected:", socket.id);

    socket.emit("setup", {
        _id: "6a5e400d1ab92a8b27cfb776",
        username: "ShashankPandey",
    });
});

socket.on("connected", () => {
    console.log("Setup successful");

    socket.emit("join chat", "6a60cce1130e9f95084cc467");
});

socket.on("message received", (message) => {
    console.log("\n📩 New Message");
    console.log(message.content);
    console.log("From:", message.sender.username);
});

