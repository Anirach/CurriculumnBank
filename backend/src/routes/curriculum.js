const express = require("express");
const router = express.Router();
const curriculumController = require("../controllers/curriculum");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

// All curriculum routes require authentication
router.use(authMiddleware.authenticate);

// GET curriculum files with optional filters
router.get("/", curriculumController.getCurriculums);

// GET single curriculum file details
router.get("/:id", curriculumController.getCurriculumById);

// GET download link for curriculum file
router.get("/:id/download", curriculumController.downloadCurriculum);

// POST new curriculum file (teachers and admins only)
router.post(
  "/",
  roleMiddleware.hasRole(["teacher", "admin"]),
  curriculumController.uploadCurriculum
);

// PUT update curriculum metadata (owner, teachers, and admins only)
router.put(
  "/:id",
  roleMiddleware.hasRole(["teacher", "admin"]),
  curriculumController.updateCurriculum
);

// DELETE curriculum file (owner, teachers, and admins only)
router.delete(
  "/:id",
  roleMiddleware.hasRole(["teacher", "admin"]),
  curriculumController.deleteCurriculum
);

module.exports = router;
