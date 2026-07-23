const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { accessChat ,
    fetchChats ,
    createGroupChat,
    renameGroup,
    addToGroup ,
    removeFromGroup,


} = require("../controllers/chatController");

router.post("/", protect, accessChat);

//for group 
router.post("/group", protect, createGroupChat);

router.get("/", protect, fetchChats);

//rename grop
router.put("/rename", protect, renameGroup);


// add and remove grp members
router.put("/groupadd", protect, addToGroup);

router.put("/groupremove", protect, removeFromGroup);


module.exports = router;
