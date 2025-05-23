/**
 * Tests for the user controller
 */

const { request, expect } = require("../testConfig");
const app = require("../../src/index");
const db = require("../../src/database");

describe("User Controller", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock database responses
    db.all.mockImplementation((query, params, callback) => {
      // Mock users
      const users = [
        {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
          role_id: 1,
          role_name: "admin",
        },
        {
          id: 2,
          name: "Teacher User",
          email: "teacher@example.com",
          role_id: 2,
          role_name: "teacher",
        },
        {
          id: 3,
          name: "Student User",
          email: "student@example.com",
          role_id: 3,
          role_name: "student",
        },
      ];

      // Return data based on query
      if (query.includes("COUNT(*)")) {
        callback(null, { total: 3 });
      } else if (query.includes("users")) {
        callback(null, users);
      }
    });

    db.get.mockImplementation((query, params, callback) => {
      // Mock single user retrieval
      if (query.includes("users") && params && params[0] === "1") {
        callback(null, {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
          role_id: 1,
          role_name: "admin",
        });
      } else if (query.includes("users") && params && params[0] === "2") {
        callback(null, {
          id: 2,
          name: "Teacher User",
          email: "teacher@example.com",
          role_id: 2,
          role_name: "teacher",
        });
      } else {
        callback(null, null);
      }
    });

    db.run.mockImplementation((query, params, callback) => {
      if (typeof callback === "function") {
        // Mock successful transaction
        callback.call({ changes: 1 });
      }
    });
  });

  describe("GET /api/users", () => {
    it("should return a list of users", async () => {
      const res = await request(app).get("/api/users").expect(200);

      expect(res.body).to.have.property("users");
      expect(res.body.users).to.be.an("array");
      expect(res.body.users.length).to.equal(3);
    });

    it("should filter users by search term", async () => {
      const res = await request(app).get("/api/users?search=Admin").expect(200);

      expect(db.all).to.have.been.called;
      // Further assertions would depend on the mock implementation
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return a single user", async () => {
      const res = await request(app).get("/api/users/1").expect(200);

      expect(res.body).to.have.property("user");
      expect(res.body.user).to.have.property("id", 1);
      expect(res.body.user).to.have.property("name", "Admin User");
      expect(res.body.user).to.have.property("role");
    });

    it("should return 404 for non-existent user", async () => {
      db.get.mockImplementationOnce((query, params, callback) => {
        callback(null, null); // No user found
      });

      const res = await request(app).get("/api/users/999").expect(404);

      expect(res.body).to.have.property("message", "User not found");
    });
  });

  describe("PUT /api/users/:id/role", () => {
    it("should update a user role", async () => {
      const res = await request(app)
        .put("/api/users/2/role")
        .send({ roleId: 1 })
        .expect(200);

      expect(res.body).to.have.property("user");
      expect(res.body.user).to.have.property("id", 2);
      expect(res.body.user.role).to.have.property("id", 1);
    });

    it("should return 400 for invalid role ID", async () => {
      const res = await request(app)
        .put("/api/users/2/role")
        .send({ roleId: 999 })
        .expect(400);

      expect(res.body).to.have.property("message", "Invalid role ID");
    });
  });
});
