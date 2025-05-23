// CurriculumDetail component tests
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CurriculumDetail from "../../../components/curriculum/CurriculumDetail";
import curriculumService from "../../../services/curriculumService";

// Mock the curriculum service
jest.mock("../../../services/curriculumService");

// Mock the react-pdf module
jest.mock("react-pdf", () => ({
  pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: "",
    },
  },
  Document: ({ children }) => <div data-testid="pdf-document">{children}</div>,
  Page: () => <div data-testid="pdf-page" />,
}));

describe("CurriculumDetail Component", () => {
  const mockCurriculum = {
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
  };

  beforeEach(() => {
    // Reset mock implementations before each test
    jest.clearAllMocks();

    // Mock the API responses
    curriculumService.getCurriculumById.mockResolvedValue(mockCurriculum);
    curriculumService.getDownloadUrl.mockResolvedValue(
      "https://drive.google.com/uc?export=download&id=drive-file-id-1"
    );
  });

  test("renders curriculum detail component with loading state", async () => {
    render(
      <MemoryRouter initialEntries={["/curriculum/1"]}>
        <Routes>
          <Route path="/curriculum/:id" element={<CurriculumDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Initially should show loading indicator
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // After loading, should show the curriculum details
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByText("Math Curriculum")).toBeInTheDocument();
    });
  });

  test("displays curriculum details correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/curriculum/1"]}>
        <Routes>
          <Route path="/curriculum/:id" element={<CurriculumDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for curriculum to load
    await waitFor(() => {
      expect(screen.getByText("Math Curriculum")).toBeInTheDocument();
    });

    // Verify details are displayed
    expect(
      screen.getByText("Math curriculum for 10th grade")
    ).toBeInTheDocument();
    expect(screen.getByText("Uploaded by: Admin User")).toBeInTheDocument();
    expect(screen.getByText("math")).toBeInTheDocument();
    expect(screen.getByText("grade-10")).toBeInTheDocument();

    // Verify action buttons are available
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.getByText("Back to List")).toBeInTheDocument();
  });

  test("shows error message when curriculum not found", async () => {
    // Mock API error
    curriculumService.getCurriculumById.mockRejectedValueOnce(
      new Error("Curriculum not found")
    );

    render(
      <MemoryRouter initialEntries={["/curriculum/999"]}>
        <Routes>
          <Route path="/curriculum/:id" element={<CurriculumDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for error to display
    await waitFor(() => {
      expect(screen.getByText(/Failed to load curriculum/)).toBeInTheDocument();
    });
  });

  test("renders PDF preview for PDF files", async () => {
    render(
      <MemoryRouter initialEntries={["/curriculum/1"]}>
        <Routes>
          <Route path="/curriculum/:id" element={<CurriculumDetail />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for curriculum to load
    await waitFor(() => {
      expect(screen.getByText("Math Curriculum")).toBeInTheDocument();
    });

    // For PDF files, should render PDF viewer
    await waitFor(() => {
      expect(screen.getByTestId("pdf-document")).toBeInTheDocument();
    });
  });
});
