// CurriculumEdit component tests
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CurriculumEdit from "../../../components/curriculum/CurriculumEdit";
import curriculumService from "../../../services/curriculumService";

// Mock the curriculum service
jest.mock("../../../services/curriculumService");

describe("CurriculumEdit Component", () => {
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
  };

  beforeEach(() => {
    // Reset mock implementations before each test
    jest.clearAllMocks();

    // Mock the API responses
    curriculumService.getCurriculumById.mockResolvedValue(mockCurriculum);
    curriculumService.updateCurriculum.mockResolvedValue({
      ...mockCurriculum,
      title: "Updated Math Curriculum",
      description: "Updated math curriculum for 10th grade",
      tags: ["math", "grade-10", "updated"],
    });

    curriculumService.getAvailableTags.mockResolvedValue([
      "math",
      "science",
      "english",
      "history",
      "grade-10",
      "updated",
    ]);
  });

  test("renders edit form with loading state", async () => {
    render(
      <MemoryRouter initialEntries={["/curriculum/1/edit"]}>
        <Routes>
          <Route path="/curriculum/:id/edit" element={<CurriculumEdit />} />
        </Routes>
      </MemoryRouter>
    );

    // Initially should show loading indicator
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // After loading, should show the edit form with curriculum data
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByText("Edit Curriculum")).toBeInTheDocument();
    });
  });

  test("loads and populates form fields with curriculum data", async () => {
    render(
      <MemoryRouter initialEntries={["/curriculum/1/edit"]}>
        <Routes>
          <Route path="/curriculum/:id/edit" element={<CurriculumEdit />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for curriculum to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("Math Curriculum")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("Math curriculum for 10th grade")
      ).toBeInTheDocument();
    });

    // Verify tags are selected
    await waitFor(() => {
      // This depends on the specific implementation of your tag selection UI
      // You might need to adjust this based on your component's structure
      expect(screen.getByText("math")).toBeInTheDocument();
      expect(screen.getByText("grade-10")).toBeInTheDocument();
    });
  });

  test("submits updated curriculum data correctly", async () => {
    render(
      <MemoryRouter initialEntries={["/curriculum/1/edit"]}>
        <Routes>
          <Route path="/curriculum/:id/edit" element={<CurriculumEdit />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for curriculum to load
    await waitFor(() => {
      expect(screen.getByDisplayValue("Math Curriculum")).toBeInTheDocument();
    });

    // Update form fields
    const titleInput = screen.getByLabelText("Title");
    fireEvent.change(titleInput, {
      target: { value: "Updated Math Curriculum" },
    });

    const descriptionInput = screen.getByLabelText("Description");
    fireEvent.change(descriptionInput, {
      target: { value: "Updated math curriculum for 10th grade" },
    });

    // Submit the form
    const saveButton = screen.getByRole("button", { name: "Save Changes" });
    fireEvent.click(saveButton);

    // Check that updateCurriculum was called with correct data
    await waitFor(() => {
      expect(curriculumService.updateCurriculum).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          title: "Updated Math Curriculum",
          description: "Updated math curriculum for 10th grade",
        })
      );
    });

    // Should show success message after submission
    await waitFor(() => {
      expect(
        screen.getByText(/Curriculum updated successfully/)
      ).toBeInTheDocument();
    });
  });

  test("shows error when curriculum fails to load", async () => {
    // Mock API error
    curriculumService.getCurriculumById.mockRejectedValueOnce(
      new Error("Curriculum not found")
    );

    render(
      <MemoryRouter initialEntries={["/curriculum/999/edit"]}>
        <Routes>
          <Route path="/curriculum/:id/edit" element={<CurriculumEdit />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for error to display
    await waitFor(() => {
      expect(screen.getByText(/Failed to load curriculum/)).toBeInTheDocument();
    });
  });
});
