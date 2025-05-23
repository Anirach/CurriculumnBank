import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import curriculumService from "../../services/curriculumService";

function CurriculumUpload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Setup dropzone for file uploads
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      // Set the first file
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tags", JSON.stringify(tags));

      // Upload file
      const uploadedFile = await curriculumService.uploadCurriculum(formData);

      setSuccess("File uploaded successfully!");

      // Redirect to the new file's detail page after a short delay
      setTimeout(() => {
        navigate(`/curriculums/${uploadedFile.id}`);
      }, 1500);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Curriculum File
      </Typography>

      <Paper sx={{ p: 3 }}>
        {/* Error and success messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                label="Title"
                variant="outlined"
                fullWidth
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />
            </Grid>

            {/* Tags */}
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <form onSubmit={handleAddTag}>
                  <TextField
                    label="Add Tag"
                    variant="outlined"
                    size="small"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    disabled={loading}
                    sx={{ mr: 1 }}
                  />
                  <Button
                    type="submit"
                    variant="outlined"
                    disabled={!currentTag.trim() || loading}
                  >
                    Add
                  </Button>
                </form>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    disabled={loading}
                  />
                ))}
              </Box>
            </Grid>

            {/* File dropzone */}
            <Grid item xs={12}>
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  bgcolor: isDragActive
                    ? "rgba(25, 118, 210, 0.1)"
                    : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(25, 118, 210, 0.05)",
                  },
                }}
              >
                <input {...getInputProps()} disabled={loading} />

                {file ? (
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      Selected file:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </Typography>
                    <Button
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      disabled={loading}
                      sx={{ mt: 1 }}
                    >
                      Remove
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <UploadIcon
                      sx={{ fontSize: 48, color: "primary.main", mb: 1 }}
                    />
                    <Typography variant="body1" gutterBottom>
                      Drag and drop a file here, or click to select a file
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Supported formats: PDF, DOCX, PPTX
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Submit button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading || !file || !title.trim()}
                startIcon={
                  loading ? <CircularProgress size={20} /> : <UploadIcon />
                }
              >
                {loading ? "Uploading..." : "Upload File"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default CurriculumUpload;
