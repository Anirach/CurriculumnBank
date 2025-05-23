/**
 * Test configuration file
 */

const request = require("supertest");
const { expect } = require("chai");

// Mock auth middleware for testing
jest.mock("../src/middleware/auth", () => ({
  authenticate: (req, res, next) => {
    // Mock a authenticated user with admin role
    req.user = {
      id: 1,
      email: "admin@example.com",
      name: "Admin User",
      role_id: 1,
    };
    next();
  },
}));

// Mock role middleware for testing
jest.mock("../src/middleware/role", () => ({
  hasRole: (roles) => (req, res, next) => {
    // Check if user has required role
    const roleMap = {
      1: "admin",
      2: "teacher",
      3: "student",
    };

    const userRole = roleMap[req.user.role_id];

    if (!userRole || !roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }

    next();
  },
}));

// Mock the database
jest.mock("../src/database", () => {
  const mockDb = {
    get: jest.fn(),
    all: jest.fn(),
    run: jest.fn(),
    serialize: jest.fn((callback) => callback()),
  };
  return mockDb;
});

// Mock the Google Drive service
jest.mock("../src/services/drive", () => {
  return {
    uploadFile: jest
      .fn()
      .mockResolvedValue({ id: "mock-file-id", name: "test-file.pdf" }),
    getFile: jest
      .fn()
      .mockResolvedValue({
        id: "mock-file-id",
        name: "test-file.pdf",
        webViewLink: "https://drive.google.com/file/d/mock-file-id/view",
      }),
    generateDownloadUrl: jest
      .fn()
      .mockResolvedValue(
        "https://drive.google.com/uc?export=download&id=mock-file-id"
      ),
    deleteFile: jest.fn().mockResolvedValue(true),
    updateFileMetadata: jest
      .fn()
      .mockResolvedValue({ id: "mock-file-id", name: "test-file.pdf" }),
  };
});

module.exports = {
  request,
  expect,
};
