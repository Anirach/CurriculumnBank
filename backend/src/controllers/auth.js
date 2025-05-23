const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const db = require("../database");
const { ROLES } = require("../config/google");

// Create a client instance for verification
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google OAuth2 login
exports.googleLogin = async (req, res) => {
  try {
    // Get token from request
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    // Get user info from Google
    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({ message: "Email not found in token" });
    }

    // Check if user exists in database
    db.get(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, user) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        let userData;

        if (!user) {
          // New user - create account
          // Default to student role (3)
          const defaultRoleId = ROLES.STUDENT;

          // Insert new user
          db.run(
            "INSERT INTO users (email, name, role_id) VALUES (?, ?, ?)",
            [email, name, defaultRoleId],
            function (err) {
              if (err) {
                console.error("Failed to create user:", err);
                return res
                  .status(500)
                  .json({ message: "Failed to create user account" });
              }

              userData = {
                id: this.lastID,
                email,
                name,
                role_id: defaultRoleId,
              };

              createAndSendToken(userData, res);
            }
          );
        } else {
          // Existing user
          userData = user;
          createAndSendToken(userData, res);
        }
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ message: "Authentication failed" });
  }
};

// Generate JWT and send response
function createAndSendToken(userData, res) {
  // Generate JWT token
  const jwtToken = jwt.sign(
    { id: userData.id, email: userData.email, role_id: userData.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token: jwtToken,
    user: userData,
  });
}

// Get current user info
exports.getCurrentUser = async (req, res) => {
  try {
    // Get user details from database
    db.get("SELECT * FROM users WHERE id = ?", [req.user.id], (err, user) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Failed to get user information" });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't send sensitive information
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role_id: user.role_id,
        created_at: user.created_at,
      };

      res.json({ user: userData });
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to get user information" });
  }
};

// Generate JWT and send response
function createAndSendToken(userData, res) {
  // Generate JWT token
  const jwtToken = jwt.sign(
    { id: userData.id, email: userData.email, role_id: userData.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token: jwtToken,
    user: userData,
  });
}

// Get current user info
exports.getCurrentUser = async (req, res) => {
  try {
    // Get user details from database
    db.get("SELECT * FROM users WHERE id = ?", [req.user.id], (err, user) => {
      if (err) {
        console.error("Database error:", err);
        return res
          .status(500)
          .json({ message: "Failed to get user information" });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Don't send sensitive information
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role_id: user.role_id,
        created_at: user.created_at,
      };

      res.json({ user: userData });
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to get user information" });
  }
};
