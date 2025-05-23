import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import curriculumService from "../../services/curriculumService";

function CurriculumList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const navigate = useNavigate();

  // Load curriculum files on initial render and when filters change
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);

        // Prepare query parameters
        const params = {
          page: pagination.page,
          limit: pagination.limit,
        };

        if (searchQuery) {
          params.search = searchQuery;
        }

        if (selectedTags.length > 0) {
          params.tags = selectedTags.join(",");
        }

        // Fetch files from API
        const response = await curriculumService.getCurriculums(params);

        setFiles(response.files);
        setPagination(response.pagination);
      } catch (err) {
        console.error("Fetch files error:", err);
        setError("Failed to load curriculum files. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [searchQuery, selectedTags, pagination.page, pagination.limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleTagClick = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      // Reset to first page when adding a tag filter
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
    // Reset to first page when removing a tag filter
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleViewDetails = (fileId) => {
    navigate(`/curriculums/${fileId}`);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Curriculum Files
      </Typography>

      {/* Search and filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search curriculum files..."
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
            sx={{ mb: 2 }}
          />
        </form>

        {/* Selected tag filters */}
        {selectedTags.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {selectedTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onDelete={() => handleRemoveTag(tag)}
                color="primary"
                variant="outlined"
              />
            ))}
            <Chip
              label="Clear All"
              onClick={handleClearFilters}
              color="secondary"
            />
          </Box>
        )}
      </Paper>

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

      {/* Curriculum files list */}
      {!loading && files.length === 0 && (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6">No curriculum files found</Typography>
          <Typography variant="body1" color="textSecondary">
            Try adjusting your search or filters, or upload a new curriculum
            file.
          </Typography>
        </Paper>
      )}

      {!loading && files.length > 0 && (
        <Grid container spacing={3}>
          {files.map((file) => (
            <Grid item xs={12} md={6} lg={4} key={file.id}>
              <Paper
                sx={{
                  p: 2,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
                onClick={() => handleViewDetails(file.id)}
              >
                <Typography variant="h6" gutterBottom noWrap>
                  {file.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{
                    mb: 2,
                    flexGrow: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {file.description}
                </Typography>

                <Box sx={{ mt: "auto" }}>
                  {/* File tags */}
                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}
                  >
                    {file.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTagClick(tag);
                        }}
                      />
                    ))}
                  </Box>

                  {/* File metadata */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="caption" color="textSecondary">
                      {new Date(file.uploadDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {file.uploader.name}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination controls - simplified for now */}
      {!loading && pagination.pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            variant="outlined"
            sx={{ mx: 1 }}
          >
            Previous
          </Button>
          <Typography sx={{ alignSelf: "center", mx: 2 }}>
            Page {pagination.page} of {pagination.pages}
          </Typography>
          <Button
            disabled={pagination.page === pagination.pages}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            variant="outlined"
            sx={{ mx: 1 }}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default CurriculumList;
