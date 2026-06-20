const express = require("express");

const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
  getAllUsers,
} = require("../controllers/userAuthController");

const { isAuthenticatedUser } = require("../middleware/userAuthMiddleware");
const {
  isAuthenticatedAdmin,
  authorizeRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/profile", isAuthenticatedUser, getUserProfile);

router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

router.get(
  "/admin/all-users",
  isAuthenticatedAdmin,
  authorizeRole("admin"),
  getAllUsers
);

module.exports = router;