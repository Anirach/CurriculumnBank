const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

// All user routes require authentication
router.use(authMiddleware.authenticate);

// GET users (admin only)
router.get("/", roleMiddleware.hasRole(["admin"]), userController.getUsers);

// GET a single user (admin only)
router.get(
  "/:id",
  roleMiddleware.hasRole(["admin"]),
  userController.getUserById
);

// PUT update user role (admin only)
router.put(
  "/:id/role",
  roleMiddleware.hasRole(["admin"]),
  userController.updateUserRole
);

module.exports = router;
