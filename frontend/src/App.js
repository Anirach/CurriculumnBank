import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Layout from "./components/layout/Layout";

// Pages
import Home from "./components/layout/Home";
import Login from "./components/auth/Login";
import CurriculumList from "./components/curriculum/CurriculumList";
import CurriculumDetail from "./components/curriculum/CurriculumDetail";
import CurriculumUpload from "./components/curriculum/CurriculumUpload";
import CurriculumEdit from "./components/curriculum/CurriculumEdit";
import UserManagement from "./components/admin/UserManagement";
import NotFound from "./components/layout/NotFound";

// Context
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/curriculums"
            element={
              <ProtectedRoute>
                <CurriculumList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/curriculums/:id"
            element={
              <ProtectedRoute>
                <CurriculumDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/curriculums/:id/edit"
            element={
              <ProtectedRoute requiredRole={["admin", "teacher"]}>
                <CurriculumEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute requiredRole={["admin", "teacher"]}>
                <CurriculumUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute requiredRole={["admin"]}>
                <UserManagement />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
