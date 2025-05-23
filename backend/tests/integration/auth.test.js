/**
 * Integration tests for authentication flow
 */

const { request, expect } = require("../testConfig");
const app = require("../../src/index");
const jwt = require("jsonwebtoken");
const db = require("../../src/database");

// Don't mock auth middleware for auth tests
jest.unmock("../../src/middleware/auth");

describe("Authentication Flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    db.get.mockImplementation((query, params, callback) => {
      if (
        query.includes("users") &&
        params &&
        params[0] === "test@example.com"
      ) {
        // Existing user
        callback(null, {
          id: 5,
          email: "test@example.com",
          name: "Test User",
          role_id: 2,
        });
      } else {
        callback(null, null);
      }
    });

    db.run.mockImplementation((query, params, callback) => {
      if (typeof callback === "function") {
        // Mock successful insert
        callback.call({ lastID: 6 });
      }
    });
  });

  describe("POST /api/auth/login", () => {
    it("should authenticate an existing user", async () => {
      // Mock the google token verification
      const mockVerify = jest.fn().mockResolvedValue({
        payload: {
          email: "test@example.com",
          name: "Test User",
          picture: "https://example.com/profile.jpg",
        },
      });
      jest
        .spyOn(
          require("google-auth-library").OAuth2Client.prototype,
          "verifyIdToken"
        )
        .mockImplementation(mockVerify);

      const res = await request(app)
        .post("/api/auth/login")
        .send({ token: "fake-google-token" })
        .expect(200);

      expect(res.body).to.have.property("token");
      expect(res.body).to.have.property("user");
      expect(res.body.user).to.have.property("id", 5);
      expect(res.body.user).to.have.property("email", "test@example.com");

      // Verify the JWT token
      const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
      expect(decoded).to.have.property("id", 5);
      expect(decoded).to.have.property("email", "test@example.com");
    });

    it("should create a new user if not exists", async () => {
      // First check returns no user
      db.get.mockImplementationOnce((query, params, callback) => {
        callback(null, null); // No existing user
      });

      // Mock the google token verification
      const mockVerify = jest.fn().mockResolvedValue({
        payload: {
          email: "newuser@example.com",
          name: "New User",
          picture: "https://example.com/newprofile.jpg",
        },
      });
      jest
        .spyOn(
          require("google-auth-library").OAuth2Client.prototype,
          "verifyIdToken"
        )
        .mockImplementation(mockVerify);

      // Second check returns the newly created user
      db.get.mockImplementationOnce((query, params, callback) => {
        callback(null, {
          id: 6,
          email: "newuser@example.com",
          name: "New User",
          role_id: 3, // New users are students by default
        });
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ token: "fake-google-token" })
        .expect(200);

      expect(db.run).to.have.been.called; // User was created
      expect(res.body).to.have.property("token");
      expect(res.body).to.have.property("user");
      expect(res.body.user).to.have.property("id", 6);
      expect(res.body.user).to.have.property("email", "newuser@example.com");
    });

    it("should return 400 for missing token", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({})
        .expect(400);

      expect(res.body).to.have.property("message", "Google token is required");
    });
  });

  describe("GET /api/auth/me", () => {
    it("should return current user info", async () => {
      // Create a valid JWT token for testing
      const token = jwt.sign(
        { id: 5, email: "test@example.com", role_id: 2 },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(res.body).to.have.property("user");
      expect(res.body.user).to.have.property("id", 5);
      expect(res.body.user).to.have.property("email", "test@example.com");
    });

    it("should return 401 for missing token", async () => {
      const res = await request(app).get("/api/auth/me").expect(401);

      expect(res.body).to.have.property("message", "Authentication required");
    });

    it("should return 401 for invalid token", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(res.body).to.have.property("message", "Authentication failed");
    });
  });
});
