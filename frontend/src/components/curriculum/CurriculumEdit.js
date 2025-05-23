import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import curriculumService from "../../services/curriculumService";

function CurriculumEdit() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [originalFile, setOriginalFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const { id } = useParams();
  const { hasRole, user } = useAuth();
  const navigate = useNavigate();

  // Fetch curriculum file details and available tags
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch file details
        const fileData = await curriculumService.getCurriculumById(id);
        setOriginalFile(fileData);
        setTitle(fileData.title);
        setDescription(fileData.description || "");
        setTags(fileData.tags || []);

        // Fetch available tags (this would be a separate API endpoint in a real implementation)
        try {
          const tagsData = await curriculumService.getAvailableTags();
          setAvailableTags(tagsData);
        } catch (tagsError) {
          console.error("Fetch tags error:", tagsError);
          // Default to empty array if tags fetch fails
          setAvailableTags([]);
        }
      } catch (err) {
        console.error("Fetch file error:", err);
        setError(
          "Failed to load curriculum file. It may have been deleted or you may not have permission to edit it."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Check if user has edit permissions
  // Either admin, or teacher who uploaded the file
  const checkPermissions = () => {
    if (!originalFile) return false;

    return (
      hasRole(["admin"]) ||
      (hasRole(["teacher"]) && originalFile.uploader?.id === user?.id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkPermissions()) {
      setError("You do not have permission to edit this file");
      return;
    }

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updatedData = {
        title: title.trim(),
        description: description.trim(),
        tags,
      };

      await curriculumService.updateCurriculum(id, updatedData);
      setSuccess("Curriculum file updated successfully");

      // Redirect back to the detail page after a short delay
      setTimeout(() => {
        navigate(`/curriculums/${id}`);
      }, 2000);
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update curriculum file. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // If there are changes, show confirmation dialog
    if (
      title !== originalFile?.title ||
      description !== (originalFile?.description || "") ||
      JSON.stringify(tags) !== JSON.stringify(originalFile?.tags || [])
    ) {
      setCancelDialogOpen(true);
    } else {
      // No changes, just navigate back
      navigate(`/curriculums/${id}`);
    }
  };

  const handleConfirmCancel = () => {
    setCancelDialogOpen(false);
    navigate(`/curriculums/${id}`);
  };

  // Form is disabled while loading, saving, or if user doesn't have permission
  const isFormDisabled = loading || saving || !checkPermissions();

  return (
    <Box>
      <Button
        startIcon={<BackIcon />}
        onClick={handleCancel}
        disabled={saving}
        sx={{ mb: 2 }}
      >
        Back to Details
      </Button>

      <Typography variant="h4" component="h1" gutterBottom>
        Edit Curriculum File
      </Typography>

      {/* Error or success message */}
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

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Edit form */}
      {!loading && originalFile && (
        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isFormDisabled}
            margin="normal"
          />

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
            disabled={isFormDisabled}
            margin="normal"
          />

          <Autocomplete
            multiple
            freeSolo
            options={availableTags}
            value={tags}
            onChange={(event, newTags) => setTags(newTags)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Add tags..."
                margin="normal"
                disabled={isFormDisabled}
              />
            )}
            disabled={isFormDisabled}
          />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="button"
              onClick={handleCancel}
              startIcon={<CancelIcon />}
              sx={{ mr: 2 }}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={isFormDisabled}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Paper>
      )}

      {/* Unsaved changes confirmation dialog */}
      <Dialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
      >
        <DialogTitle>Discard Changes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have unsaved changes that will be lost if you navigate away. Do
            you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmCancel} color="error" autoFocus>
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CurriculumEdit;
