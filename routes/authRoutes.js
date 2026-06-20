const express = require("express");
const {registerAdmin, loginAdmin, logoutAdmin, getAdminProfile } = require ("../controllers/authController");

const {isAuthenticatedAdmin, authorizeRole} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);

router.get("/profile", isAuthenticatedAdmin, authorizeRole("admin"), getAdminProfile);

module.exports = router;