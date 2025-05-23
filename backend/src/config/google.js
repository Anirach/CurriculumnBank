// Google OAuth 2.0 Configuration
const { OAuth2Client } = require("google-auth-library");

// Environment variables for Google OAuth
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000";

// Create an OAuth client
const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

module.exports = {
  oAuth2Client,
  // Role mappings
  ROLES: {
    ADMIN: 1,
    TEACHER: 2,
    STUDENT: 3,
  },
};
