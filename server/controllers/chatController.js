const Chat = require("../models/Chat");
const Message = require("../models/Message");


const accessChat = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        let chat = await Chat.findOne({
            isGroupChat: false,
            $and: [
                {
                    users: {
                        $elemMatch: {
                            $eq: req.user._id,
                        },
                    },
                },
                {
                    users: {
                        $elemMatch: {
                            $eq: userId,
                        },
                    },
                },
            ],
        })
            .populate("users", "username")
            .populate("latestMessage");

        if (chat) {
            return res.status(200).json({
                success: true,
                chat,
            });
        }

        chat = await Chat.create({
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        });

        chat = await Chat.findById(chat._id)
            .populate("users", "-password -__v");

        res.status(201).json({
            success: true,
            chat,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};





//===============fetch chats====================
const fetchChats = async (req, res) => {
    try {

        const chats = await Chat.find({
            users: {
                $elemMatch: {
                    $eq: req.user._id,
                },
            },
        })
            .populate("users", "username")
            .populate({
                path: "latestMessage",
                populate: {
                    path: "sender",
                    select: "username",
                },
            })
            .sort({
                updatedAt: -1,
            });

        res.status(200).json({
            success: true,
            count: chats.length,
            chats,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



//===============for GROUP
const createGroupChat = async (req, res) => {
    try {

        let { users, chatName } = req.body;

        if (!users || !chatName) {
            return res.status(400).json({
                success: false,
                message: "Users and chat name are required",
            });
        }

        // Ensure users is an array
        if (!Array.isArray(users)) {
            return res.status(400).json({
                success: false,
                message: "Users must be an array",
            });
        }

        // Minimum 3 users including creator
        if (users.length < 2) {
            return res.status(400).json({
                success: false,
                message: "A group chat requires at least 3 members including you.",
            });
        }

        // Add creator automatically
        users.push(req.user._id);
        // Remove duplicates ye hata dena agr kaam na kre please 🙏...
        users = [...new Set(users.map(id => id.toString()))];


        const groupChat = await Chat.create({
            chatName,
            users,
            isGroupChat: true,
            groupAdmin: req.user._id,
        });

        const fullGroupChat = await Chat.findById(groupChat._id)
            .populate("users", "username")
            .populate("groupAdmin", "username");

        res.status(201).json({
            success: true,
            groupChat: fullGroupChat,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



//=================renaming grp ===========

const renameGroup = async (req, res) => {
    try {

        const { chatId, chatName } = req.body;

        if (!chatId || !chatName) {
            return res.status(400).json({
                success: false,
                message: "Chat ID and new chat name are required",
            });
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                chatName,
            },
            {
                new: true,
            }
        )
            .populate("users", "username")
            .populate("groupAdmin", "username");

        if (!updatedChat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        res.status(200).json({
            success: true,
            chat: updatedChat,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ================ add and remove group members =============
const addToGroup = async (req, res) => {
    try {

        const { chatId, userId } = req.body;

        if (!chatId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID and User ID are required",
            });
        }

        // Only group admin can add members
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        if (chat.groupAdmin.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the group admin can add members",
            });
        }

        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $addToSet: {
                    users: userId,
                },
            },
            {
                new: true,
            }
        )
            .populate("users", "username")
            .populate("groupAdmin", "username");

        res.status(200).json({
            success: true,
            chat: updatedChat,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



const removeFromGroup = async (req, res) => {
    try {

        const { chatId, userId } = req.body;

        if (!chatId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID and User ID are required",
            });
        }

        // Only group admin can remove members
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        if (chat.groupAdmin.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only the group admin can remove members",
            });
        }

        //admin cant himself out
          if (chat.groupAdmin.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: "Group admin cannot remove themselves.",
            });
        }
        


        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
                $pull: {
                    users: userId,
                },
            },
            {
                new: true,
            }
        )
            .populate("users", "username")
            .populate("groupAdmin", "username");

        res.status(200).json({
            success: true,
            chat: updatedChat,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};







module.exports = {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addToGroup,
    removeFromGroup,
};