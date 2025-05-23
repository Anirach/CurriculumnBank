const express = require("express");
const router = express.Router();
const db = require("../database");
const authMiddleware = require("../middleware/auth");

// Get all tags (for autocomplete, etc.)
router.get("/", authMiddleware.authenticate, (req, res) => {
  db.all("SELECT name FROM tags ORDER BY name ASC", (err, tags) => {
    if (err) {
      console.error("Get tags error:", err);
      return res.status(500).json({ message: "Failed to retrieve tags" });
    }

    res.json({
      tags: tags.map((tag) => tag.name),
    });
  });
});

module.exports = router;
