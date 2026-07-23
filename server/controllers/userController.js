const User = require("../models/User");

const searchUsers = async (req, res) => {
    try {
        const search = req.query.search || "";

        if (search.trim().length < 2) {
    return res.status(200).json({
        success: true,
        count: 0,
        users: [],
    });
}

        const users = await User.find({
            username: {
                $regex: search,
                $options: "i",
            },
            _id: {
                $ne: req.user._id,
            },
        }).select("username");

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    searchUsers,
};