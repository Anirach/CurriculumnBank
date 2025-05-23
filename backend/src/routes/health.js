// Health check routes
const express = require("express");
const router = express.Router();

// Simple health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date(),
    message: "CurriculumBank API is running",
  });
});

module.exports = router;
