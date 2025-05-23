// CurriculumList component tests
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CurriculumList from "../../../components/curriculum/CurriculumList";
import curriculumService from "../../../services/curriculumService";

// Mock the curriculum service
jest.mock("../../../services/curriculumService");

describe("CurriculumList Component", () => {
  const mockCurriculums = {
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
  };

  beforeEach(() => {
    // Reset mock implementations before each test
    jest.clearAllMocks();

    // Mock the API response
    curriculumService.getCurriculums.mockResolvedValue(mockCurriculums);
  });

  test("renders curriculum list component with loading state", async () => {
    render(
      <MemoryRouter>
        <CurriculumList />
      </MemoryRouter>
    );

    // Initially should show loading indicator
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // After loading, should show the curriculum list
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByText("Curriculum Files")).toBeInTheDocument();
    });
  });

  test("displays the list of curriculum files", async () => {
    render(
      <MemoryRouter>
        <CurriculumList />
      </MemoryRouter>
    );

    // Wait for curriculum files to load
    await waitFor(() => {
      expect(screen.getByText("Math Curriculum")).toBeInTheDocument();
      expect(screen.getByText("Science Curriculum")).toBeInTheDocument();
    });

    // Verify descriptions are displayed
    expect(
      screen.getByText("Math curriculum for 10th grade")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Science curriculum for 10th grade")
    ).toBeInTheDocument();

    // Verify uploaders are displayed
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Teacher User")).toBeInTheDocument();

    // Verify tags are displayed
    expect(screen.getByText("math")).toBeInTheDocument();
    expect(screen.getByText("science")).toBeInTheDocument();
    expect(screen.getAllByText("grade-10")).toHaveLength(2);
  });

  test('shows "No files found" when no curriculum files exist', async () => {
    // Mock empty response
    curriculumService.getCurriculums.mockResolvedValueOnce({
      files: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
      },
    });

    render(
      <MemoryRouter>
        <CurriculumList />
      </MemoryRouter>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    // Verify no files message is displayed
    expect(screen.getByText("No curriculum files found")).toBeInTheDocument();
  });

  test("calls API with correct filter parameters", async () => {
    render(
      <MemoryRouter>
        <CurriculumList />
      </MemoryRouter>
    );

    // Wait for initial API call to complete
    await waitFor(() => {
      expect(curriculumService.getCurriculums).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
        })
      );
    });
  });
});
