import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import userService from "../../services/userService";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUserRole, setSelectedUserRole] = useState(null);

  const itemsPerPage = 10;

  // Available roles
  const roles = [
    { id: 1, name: "admin" },
    { id: 2, name: "teacher" },
    { id: 3, name: "student" },
  ];

  // Load users on initial render and when filters or page changes
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getUsers({
          search: searchQuery,
          page,
          limit: itemsPerPage,
        });
        setUsers(response.users);
        setTotalPages(Math.ceil(response.total / itemsPerPage));
      } catch (err) {
        console.error("Fetch users error:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchQuery, page]);

  const handleRoleChange = async (userId, newRoleId) => {
    // Store the selected user and role for confirmation
    setSelectedUserRole({ userId, roleId: newRoleId });
    setConfirmDialogOpen(true);
  };

  const confirmRoleChange = async () => {
    if (!selectedUserRole) return;

    try {
      setError("");
      setUpdateSuccess("");

      // Update role on the server
      const updatedUser = await userService.updateUserRole(
        selectedUserRole.userId,
        selectedUserRole.roleId
      );

      // Update local state
      setUsers(
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );

      setUpdateSuccess(
        `Updated role for ${updatedUser.name} to ${updatedUser.role.name}`
      );

      // Clear success message after a delay
      setTimeout(() => {
        setUpdateSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Update role error:", err);
      setError("Failed to update user role. Please try again.");
    } finally {
      setConfirmDialogOpen(false);
      setSelectedUserRole(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        User Management
      </Typography>

      {/* Search bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery("")} edge="end">
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </Paper>

      {/* Error and success messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {updateSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {updateSuccess}
        </Alert>
      )}

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Users table */}
      {!loading && users.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">No users found</Typography>
          {searchQuery && (
            <Typography variant="body1" color="textSecondary">
              Try adjusting your search query.
            </Typography>
          )}
        </Paper>
      )}

      {!loading && users.length > 0 && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <FormControl sx={{ minWidth: 120 }}>
                        <Select
                          value={user.role.id}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                          size="small"
                        >
                          {roles.map((role) => (
                            <MenuItem key={role.id} value={role.id}>
                              {role.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          // View user details - could be implemented with a modal or navigation
                          alert(`User details for ${user.name}`);
                        }}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Stack
              spacing={2}
              sx={{ mt: 3, display: "flex", alignItems: "center" }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          )}
        </>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Role Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change this user's role? This will affect
            their permissions in the system.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmRoleChange}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UserManagement;
