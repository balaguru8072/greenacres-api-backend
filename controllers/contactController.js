const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

const createContact = async (req, res) => {
    try {
        const { username, email, phone, subject, message } = req.body;

        if (!username || !email || !phone || !subject) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        const contact = await Contact.create({
            username,
            email,
            phone,
            subject,
            message,
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Real Estate Contact" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `New Contact Message - ${subject}`,
            html: `
        <h2>New Contact Form Message</h2>
        <p><b>Name:</b> ${username}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b> ${message || "No message"}</p>
      `,
        });

        return res.status(201).json({
            success: true,
            message: "Contact submitted successfully",
            contact,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getAllContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: contacts.length,
            contacts,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const replyContactMail = async (req, res) => {
    try {
        const { to, subject, message, contactId } = req.body;

        if (!to || !subject || !message || !contactId) {
            return res.status(400).json({
                success: false,
                message: "All fields required",
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Estate Admin" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: `
        <p>${message}</p>
        <br/>
        <p>Regards,<br/>Estate Admin</p>
      `,
        });

        // ✅ IMPORTANT: update DB
        await Contact.findByIdAndUpdate(contactId, {
            isReplied: true,
            isRead: true,
        });

        res.status(200).json({
            success: true,
            message: "Reply mail sent successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getSingleContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found",
            });
        }

        res.status(200).json({
            success: true,
            contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        res.status(200).json({
            success: true,
            contact,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createContact,
    getAllContacts,
    replyContactMail,
    getSingleContact,
    markAsRead,
    deleteContact,
};