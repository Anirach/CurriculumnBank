// Test setup file
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

// Mock auth context for testing
jest.mock("../contexts/AuthContext", () => {
  const originalModule = jest.requireActual("../contexts/AuthContext");

  const mockAuthContext = {
    isAuthenticated: true,
    user: {
      id: 1,
      name: "Test User",
      email: "test@example.com",
      role_id: 1,
    },
    loading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
    hasRole: jest.fn((roles) => roles.includes("admin")),
  };

  return {
    ...originalModule,
    AuthProvider: ({ children }) => children,
    useAuth: () => mockAuthContext,
  };
});

// Mock API services
jest.mock("../services/curriculumService", () => ({
  getCurriculums: jest.fn().mockResolvedValue({
    files: [
      {
        id: 1,
        title: "Math Curriculum",
        description: "Math curriculum for 10th grade",
        fileType: "pdf",
        uploadDate: "2025-05-20T10:00:00Z",
        uploader: {
          id: 1,
          name: "Admin User",
        },
        tags: ["math", "grade-10"],
      },
      {
        id: 2,
        title: "Science Curriculum",
        description: "Science curriculum for 10th grade",
        fileType: "docx",
        uploadDate: "2025-05-19T10:00:00Z",
        uploader: {
          id: 2,
          name: "Teacher User",
        },
        tags: ["science", "grade-10"],
      },
    ],
    pagination: {
      total: 2,
      page: 1,
      limit: 10,
      pages: 1,
    },
  }),
  getCurriculumById: jest.fn().mockResolvedValue({
    id: 1,
    title: "Math Curriculum",
    description: "Math curriculum for 10th grade",
    fileType: "pdf",
    fileId: "drive-file-id-1",
    uploadDate: "2025-05-20T10:00:00Z",
    uploader: {
      id: 1,
      name: "Admin User",
    },
    tags: ["math", "grade-10"],
    previewLink: "https://drive.google.com/file/d/drive-file-id-1/view",
  }),
  getDownloadUrl: jest
    .fn()
    .mockResolvedValue(
      "https://drive.google.com/uc?export=download&id=drive-file-id-1"
    ),
  uploadCurriculum: jest.fn().mockResolvedValue({
    id: 3,
    title: "New Curriculum",
    description: "New curriculum test",
    fileType: "pdf",
    fileId: "drive-file-id-3",
    uploadDate: "2025-05-23T10:00:00Z",
    uploader: {
      id: 1,
      name: "Admin User",
    },
    tags: ["test"],
  }),
  updateCurriculum: jest.fn().mockResolvedValue({
    id: 1,
    title: "Updated Math Curriculum",
    description: "Updated math curriculum for 10th grade",
    fileType: "pdf",
    fileId: "drive-file-id-1",
    uploadDate: "2025-05-20T10:00:00Z",
    uploader: {
      id: 1,
      name: "Admin User",
    },
    tags: ["math", "grade-10", "updated"],
  }),
  deleteCurriculum: jest
    .fn()
    .mockResolvedValue({ message: "Curriculum file deleted successfully" }),
  getAvailableTags: jest
    .fn()
    .mockResolvedValue(["math", "science", "english", "history", "grade-10"]),
}));

jest.mock("../services/userService", () => ({
  getUsers: jest.fn().mockResolvedValue({
    users: [
      {
        id: 1,
        name: "Admin User",
        email: "admin@example.com",
        role: {
          id: 1,
          name: "admin",
        },
      },
      {
        id: 2,
        name: "Teacher User",
        email: "teacher@example.com",
        role: {
          id: 2,
          name: "teacher",
        },
      },
      {
        id: 3,
        name: "Student User",
        email: "student@example.com",
        role: {
          id: 3,
          name: "student",
        },
      },
    ],
    total: 3,
    page: 1,
    limit: 10,
    pages: 1,
  }),
  updateUserRole: jest.fn().mockResolvedValue({
    id: 2,
    name: "Teacher User",
    email: "teacher@example.com",
    role: {
      id: 1,
      name: "admin",
    },
  }),
  getUserById: jest.fn().mockResolvedValue({
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    role: {
      id: 1,
      name: "admin",
    },
  }),
}));

// Helper for rendering with router
const renderWithRouter = (ui, { route = "/", path = "/" } = {}) => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={path} element={ui} />
      </Routes>
    </MemoryRouter>
  );
};

// Export testing utilities
export { render, screen, fireEvent, waitFor, userEvent, renderWithRouter };
