const express = require("express");
const {
  getChatMessages,
  sendAdminMessage,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/:contactId", getChatMessages);
router.post("/send", sendAdminMessage);

module.exports = router;