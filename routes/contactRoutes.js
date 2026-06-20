const express = require("express");
const {
  createContact,
  getAllContacts,
  replyContactMail,
  getSingleContact,
  markAsRead,
  deleteContact
} = require("../controllers/contactController");

const router = express.Router();

router.post("/", createContact);
router.get("/", getAllContacts);
router.post("/reply", replyContactMail);
router.get("/:id", getSingleContact);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteContact);

module.exports = router;