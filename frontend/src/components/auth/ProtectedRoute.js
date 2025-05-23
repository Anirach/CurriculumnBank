import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";

function ProtectedRoute({
  children,
  requiredRole = ["admin", "teacher", "student"],
}) {
  const { isAuthenticated, user, loading, hasRole } = useAuth();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Check for required role if specified
  if (requiredRole && requiredRole.length > 0) {
    // If user doesn't have the required role, show access denied
    if (!hasRole(requiredRole)) {
      return (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Access Denied
          </Typography>
          <Typography variant="body1">
            You don't have permission to access this page.
          </Typography>
        </Box>
      );
    }
  }

  // If authenticated and has required role, render the children
  return children;
}

export default ProtectedRoute;
