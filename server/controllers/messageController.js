const Message = require("../models/Message");
const Chat = require("../models/Chat");
const { getIO } = require("../socket");
const EVENTS = require("../constants/socketEvents");

const sendMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;

        if (!chatId || !content) {
            return res.status(400).json({
                success: false,
                message: "Chat ID and content are required",
            });
        }

        let message = await Message.create({
            sender: req.user._id,
            content,
            chat: chatId,
        });

        message = await message.populate("sender", "username");
        message = await message.populate({
        path: "chat",
        populate: {
        path: "users",
        select: "username",
                            },
});

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message._id,
        });

    const io = getIO();

    if (message.chat.users) {

    message.chat.users.forEach((user) => {

        if (user._id.toString() === message.sender._id.toString()) {
            return;
        }

        io.to(user._id.toString()).emit(EVENTS.MESSAGE_RECEIVED, message);

    });

}

        res.status(201).json({
            success: true,
            message,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const fetchMessages = async (req, res) => {
    try {

        const { chatId } = req.params;

        const messages = await Message.find({
            chat: chatId,
        })
            .populate("sender", "username")
            .populate("chat");

        res.status(200).json({
            success: true,
            count: messages.length,
            messages,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    sendMessage,
    fetchMessages,
};