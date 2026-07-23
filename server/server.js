require("dotenv").config();
const http = require("http");

const app = require("./app");
const connectDB = require("./config/db");

const { initializeSocket } = require("./socket");


// jbjb 

//jhvuu


const PORT = process.env.PORT || 3000;
//now for socket
const server = http.createServer(app);

initializeSocket(server);

const startServer = async () => {
    await connectDB();

        server.listen(PORT, () => {
    console.log(`🚀 ChatSphere Server running on http://localhost:${PORT}`);
});
};

startServer();
