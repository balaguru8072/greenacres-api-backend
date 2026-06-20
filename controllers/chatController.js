const ChatMessage = require("../models/chatMessage");
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

const getChatMessages = async (req, res) => {
  try {
    const { contactId } = req.params;

    const messages = await ChatMessage.find({ contactId }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const sendAdminMessage = async (req, res) => {
  try {
    const { contactId, text } = req.body;

    if (!contactId || !text) {
      return res.status(400).json({
        success: false,
        message: "contactId and text required",
      });
    }

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    const message = await ChatMessage.create({
      contactId,
      sender: "admin",
      text,
      status: "sent",
    });

    // mail send to customer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Real Estate Admin" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: `Reply: ${contact.subject}`,
      html: `
        <p>${text}</p>
        <br/>
        <p>Regards,<br/>Real Estate Admin</p>
      `,
    });

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

module.exports = {
  getChatMessages,
  sendAdminMessage,
};