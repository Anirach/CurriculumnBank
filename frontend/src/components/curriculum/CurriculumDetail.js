import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
} from "@mui/material";
import {
  CloudDownload as DownloadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import curriculumService from "../../services/curriculumService";

function CurriculumDetail() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { id } = useParams();
  const { hasRole, user } = useAuth();
  const navigate = useNavigate();

  // Fetch curriculum file details
  useEffect(() => {
    const fetchFile = async () => {
      try {
        setLoading(true);
        const fileData = await curriculumService.getCurriculumById(id);
        setFile(fileData);
      } catch (err) {
        console.error("Fetch file error:", err);
        setError(
          "Failed to load curriculum file. It may have been deleted or you may not have permission to view it."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [id]);

  const handleDownload = async () => {
    try {
      const downloadUrl = await curriculumService.getDownloadUrl(id);
      // Open the download link in a new tab
      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error("Download error:", err);
      setError("Failed to download file. Please try again.");
    }
  };

  const handleEdit = () => {
    // Navigate to the edit page
    navigate(`/curriculums/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await curriculumService.deleteCurriculum(id);
      // Redirect to curriculum list after successful deletion
      navigate("/curriculums");
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete file. Please try again.");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const handleBack = () => {
    navigate("/curriculums");
  };

  // Check if user has edit/delete permissions
  // Either admin, or teacher who uploaded the file
  const canEditDelete =
    hasRole(["admin"]) ||
    (hasRole(["teacher"]) && file?.uploader?.id === user?.id);

  return (
    <Box>
      <Button startIcon={<BackIcon />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Curriculum List
      </Button>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* File details */}
      {!loading && file && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Typography variant="h4" component="h1" gutterBottom>
                {file.title}
              </Typography>

              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  sx={{ mr: 1 }}
                >
                  Download
                </Button>

                {canEditDelete && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleEdit}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => setDeleteDialogOpen(true)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </Box>

            <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
              {file.description}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Uploaded by
                </Typography>
                <Typography variant="body2">{file.uploader.name}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Upload Date
                </Typography>
                <Typography variant="body2">
                  {new Date(file.uploadDate).toLocaleDateString()}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  File Type
                </Typography>
                <Typography variant="body2" textTransform="uppercase">
                  {file.fileType}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Tags
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {file.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* File preview */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Preview
            </Typography>

            <Box sx={{ mt: 2, height: "500px", border: "1px solid #ddd" }}>
              {/* This is a placeholder for the actual preview */}
              {/* In a real implementation, you would integrate a PDF/DOCX viewer */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  bgcolor: "#f5f5f5",
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body1" gutterBottom>
                    File Preview
                  </Typography>
                  <Link
                    href={file.previewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open in Google Drive
                  </Link>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Delete confirmation dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete "{file.title}"? This action
                cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleDelete} color="error" autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}

export default CurriculumDetail;
