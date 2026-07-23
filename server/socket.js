const { Server } = require("socket.io");
const EVENTS = require("./constants/socketEvents");

let io;

const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`✅ User Connected: ${socket.id}`);

        // User joins their personal room
        socket.on(EVENTS.SETUP, (userData) => {
            socket.join(userData._id.toString());

            console.log(
                `${userData.username} joined room ${userData._id}`
            );

            socket.emit(EVENTS.CONNECTED);
        });

        // User joins the currently opened chat
        socket.on(EVENTS.JOIN_CHAT, (chatId) => {
            socket.join(chatId);

            console.log(
                `Socket ${socket.id} joined chat ${chatId}`
            );
        });

        socket.on("disconnect", () => {
            console.log(`❌ User Disconnected: ${socket.id}`);
        });
    });
};

const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized.");
    }

    return io;
};

module.exports = {
    initializeSocket,
    getIO,
};