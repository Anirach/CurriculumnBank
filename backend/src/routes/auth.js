const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const authMiddleware = require("../middleware/auth");

// Google OAuth2 login
router.post("/login", authController.googleLogin);

// Get current user info
router.get("/me", authMiddleware.authenticate, authController.getCurrentUser);

module.exports = router;
