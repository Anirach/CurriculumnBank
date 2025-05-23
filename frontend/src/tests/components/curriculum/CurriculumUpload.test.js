// CurriculumUpload component tests
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import CurriculumUpload from "../../../components/curriculum/CurriculumUpload";
import curriculumService from "../../../services/curriculumService";

// Mock the curriculum service
jest.mock("../../../services/curriculumService");

// Mock the react-dropzone module
jest.mock("react-dropzone", () => ({
  __esModule: true,
  default: ({ onDrop, children }) => {
    return (
      <div
        data-testid="dropzone"
        onClick={() => {
          const file = new File(["file contents"], "test.pdf", {
            type: "application/pdf",
          });
          onDrop([file]);
        }}
      >
        {children}
      </div>
    );
  },
}));

describe("CurriculumUpload Component", () => {
  beforeEach(() => {
    // Reset mock implementations before each test
    jest.clearAllMocks();

    // Mock the API responses
    curriculumService.uploadCurriculum.mockResolvedValue({
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
    });

    curriculumService.getAvailableTags.mockResolvedValue([
      "math",
      "science",
      "english",
      "history",
      "grade-10",
    ]);
  });

  test("renders upload form correctly", async () => {
    render(
      <MemoryRouter>
        <CurriculumUpload />
      </MemoryRouter>
    );

    // Form elements should be present
    expect(screen.getByText("Upload New Curriculum")).toBeInTheDocument();
    expect(
      screen.getByText("Drop files here or click to select")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();

    // Tags should load
    await waitFor(() => {
      expect(screen.getByText("Tags")).toBeInTheDocument();
    });
  });

  test("handles file selection", async () => {
    render(
      <MemoryRouter>
        <CurriculumUpload />
      </MemoryRouter>
    );

    // Click the dropzone to simulate file selection
    fireEvent.click(screen.getByTestId("dropzone"));

    // Should show the selected file name
    await waitFor(() => {
      expect(screen.getByText("test.pdf")).toBeInTheDocument();
    });
  });

  test("submits the form correctly", async () => {
    render(
      <MemoryRouter>
        <CurriculumUpload />
      </MemoryRouter>
    );

    // Fill in the form
    fireEvent.click(screen.getByTestId("dropzone"));
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "New Curriculum" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "New curriculum test" },
    });

    await waitFor(() => {
      expect(screen.getByText("test.pdf")).toBeInTheDocument();
    });

    // Submit the form
    const submitButton = screen.getByRole("button", { name: "Upload" });
    fireEvent.click(submitButton);

    // Check that uploadCurriculum was called with correct data
    await waitFor(() => {
      expect(curriculumService.uploadCurriculum).toHaveBeenCalledWith(
        expect.any(FormData)
      );
    });

    // Should show success message after submission
    await waitFor(() => {
      expect(
        screen.getByText(/Curriculum uploaded successfully/)
      ).toBeInTheDocument();
    });
  });

  test("shows validation errors for missing required fields", async () => {
    render(
      <MemoryRouter>
        <CurriculumUpload />
      </MemoryRouter>
    );

    // Submit without providing required fields
    const submitButton = screen.getByRole("button", { name: "Upload" });
    fireEvent.click(submitButton);

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/Please select a file/)).toBeInTheDocument();
      expect(screen.getByText(/Title is required/)).toBeInTheDocument();
    });
  });
});
