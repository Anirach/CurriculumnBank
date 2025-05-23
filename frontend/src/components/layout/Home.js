import React from "react";
import { Box, Typography, Button, Paper, Grid } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function Home() {
  const { isAuthenticated, hasRole } = useAuth();

  return (
    <Box sx={{ mt: 4 }}>
      <Paper
        sx={{
          p: 4,
          mb: 4,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          backgroundColor: "primary.main",
          borderRadius: 2,
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to CurriculumnBank
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Store, retrieve, and view curriculum files from Google Drive
        </Typography>
        {!isAuthenticated && (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/login"
            sx={{ mt: 2 }}
          >
            Get Started
          </Button>
        )}
        {isAuthenticated && (
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/curriculums"
            sx={{ mt: 2 }}
          >
            Browse Curriculums
          </Button>
        )}
      </Paper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Store
            </Typography>
            <Typography variant="body1" paragraph>
              Upload curriculum files securely to Google Drive with metadata,
              tags, and descriptions.
            </Typography>
            {isAuthenticated && hasRole(["admin", "teacher"]) && (
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/upload"
              >
                Upload Files
              </Button>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" component="h3" gutterBottom>
              Retrieve
            </Typography>
            <Typography variant="body1" paragraph>
              Search and filter curriculum files by keywords, tags, uploader, or
              date.
            </Typography>
            {isAuthenticated && (
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/curriculums"
              >
                Browse Files
              </Button>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h5" component="h3" gutterBottom>
              View
            </Typography>
            <Typography variant="body1" paragraph>
              Preview curriculum files in-browser without downloading, with
              detailed metadata.
            </Typography>
            {isAuthenticated && (
              <Button
                variant="outlined"
                color="primary"
                component={RouterLink}
                to="/curriculums"
              >
                View Files
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Home;
