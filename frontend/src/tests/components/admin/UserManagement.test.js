// UserManagement component tests
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import UserManagement from "../../../components/admin/UserManagement";
import userService from "../../../services/userService";

// Mock the user service
jest.mock("../../../services/userService");

describe("UserManagement Component", () => {
  const mockUsers = {
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
  };

  beforeEach(() => {
    // Reset mock implementations before each test
    jest.clearAllMocks();

    // Mock the API responses
    userService.getUsers.mockResolvedValue(mockUsers);
    userService.updateUserRole.mockImplementation((userId, roleId) => {
      const user = mockUsers.users.find((u) => u.id === userId);
      if (!user) throw new Error("User not found");

      const updatedUser = {
        ...user,
        role: {
          id: roleId,
          name: roleId === 1 ? "admin" : roleId === 2 ? "teacher" : "student",
        },
      };

      return Promise.resolve(updatedUser);
    });
  });

  test("renders user management component with loading state", async () => {
    render(
      <MemoryRouter>
        <UserManagement />
      </MemoryRouter>
    );

    // Initially should show loading indicator
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // After loading, should show the user table
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      expect(screen.getByText("User Management")).toBeInTheDocument();
    });
  });

  test("displays the list of users", async () => {
    render(
      <MemoryRouter>
        <UserManagement />
      </MemoryRouter>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText("Admin User")).toBeInTheDocument();
      expect(screen.getByText("Teacher User")).toBeInTheDocument();
      expect(screen.getByText("Student User")).toBeInTheDocument();
    });

    // Check table headers
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("allows searching for users", async () => {
    // Mock search results
    userService.getUsers.mockResolvedValueOnce({
      users: [mockUsers.users[0]],
      total: 1,
    });

    render(
      <MemoryRouter>
        <UserManagement />
      </MemoryRouter>
    );

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText("Admin User")).toBeInTheDocument();
    });

    // Enter search query
    const searchInput = screen.getByPlaceholderText(
      "Search users by name or email..."
    );
    fireEvent.change(searchInput, { target: { value: "admin" } });
    fireEvent.submit(searchInput);

    // Verify search was called with correct parameters
    expect(userService.getUsers).toHaveBeenCalledWith(
      expect.objectContaining({
        search: "admin",
        page: 1,
        limit: 10,
      })
    );
  });

  test("shows confirmation dialog when changing user role", async () => {
    render(
      <MemoryRouter>
        <UserManagement />
      </MemoryRouter>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText("Admin User")).toBeInTheDocument();
    });

    // Find the role select for the second user (Teacher)
    const selects = screen.getAllByRole("combobox");
    expect(selects.length).toBe(3); // One for each user

    // Change the role
    fireEvent.mouseDown(selects[1]); // Open the select dropdown for Teacher User
    const options = screen.getAllByRole("option");
    fireEvent.click(options[0]); // Click the "admin" option

    // Confirm dialog should appear
    expect(screen.getByText("Confirm Role Change")).toBeInTheDocument();
    expect(
      screen.getByText(/Are you sure you want to change this user's role/)
    ).toBeInTheDocument();
  });

  test("updates user role when confirmed", async () => {
    render(
      <MemoryRouter>
        <UserManagement />
      </MemoryRouter>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText("Teacher User")).toBeInTheDocument();
    });

    // Find the role select for the second user (Teacher)
    const selects = screen.getAllByRole("combobox");

    // Change the role
    fireEvent.mouseDown(selects[1]); // Open the select dropdown for Teacher User
    const options = screen.getAllByRole("option");
    fireEvent.click(options[0]); // Click the "admin" option

    // Confirm the change
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    // Check that the API was called correctly
    await waitFor(() => {
      expect(userService.updateUserRole).toHaveBeenCalledWith(2, 1);
    });

    // Success message should be displayed
    await waitFor(() => {
      expect(screen.getByText(/Updated role for/)).toBeInTheDocument();
    });
  });

  test("shows error message when user fetch fails", async () => {
    userService.getUsers.mockRejectedValueOnce(
      new Error("Failed to load users")
    );
    render(
      <MemoryRouter>
        <UserManagement />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/Failed to load users/)).toBeInTheDocument();
    });
  });

  test("shows error message when role update fails", async () => {
    userService.updateUserRole.mockRejectedValueOnce(
      new Error("Failed to update user role")
    );
    render(
      <MemoryRouter>
        <UserManagement />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Teacher User")).toBeInTheDocument();
    });
    const selects = screen.getAllByRole("combobox");
    fireEvent.mouseDown(selects[1]);
    const options = screen.getAllByRole("option");
    fireEvent.click(options[0]);
    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(
        screen.getByText(/Failed to update user role/)
      ).toBeInTheDocument();
    });
  });

  test("shows 'No users found' when user list is empty", async () => {
    userService.getUsers.mockResolvedValueOnce({ users: [], total: 0 });
    render(
      <MemoryRouter>
        <UserManagement />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("No users found")).toBeInTheDocument();
    });
  });

  test("pagination: next/prev page calls API with correct page number", async () => {
    userService.getUsers.mockResolvedValue({
      users: mockUsers.users,
      total: 30, // 3 pages if 10 per page
    });
    render(
      <MemoryRouter>
        <UserManagement />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Admin User")).toBeInTheDocument();
    });
    // Go to page 2
    const nextPageBtn = screen.getByRole("button", { name: "Go to page 2" });
    fireEvent.click(nextPageBtn);
    await waitFor(() => {
      expect(userService.getUsers).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2, limit: 10 })
      );
    });
    // Go back to page 1
    const prevPageBtn = screen.getByRole("button", { name: "Go to page 1" });
    fireEvent.click(prevPageBtn);
    await waitFor(() => {
      expect(userService.getUsers).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 1, limit: 10 })
      );
    });
  });

  test("pagination: disables prev/next on first/last page", async () => {
    userService.getUsers.mockResolvedValue({
      users: mockUsers.users,
      total: 10, // Only 1 page
    });
    render(
      <MemoryRouter>
        <UserManagement />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText("Admin User")).toBeInTheDocument();
    });
    // Only one page, so prev/next should be disabled
    const prevBtn = screen.getByRole("button", { name: "Go to page 0" });
    const nextBtn = screen.getByRole("button", { name: "Go to page 2" });
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeDisabled();
  });
});
