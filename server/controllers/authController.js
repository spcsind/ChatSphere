const registerUser = (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            username,
            email,
        },
    });
};

module.exports = {
    registerUser,
};