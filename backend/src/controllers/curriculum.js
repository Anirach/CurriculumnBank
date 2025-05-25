const driveService = require("../services/drive");
const db = require("../database");

// Get curriculum files with optional filtering
exports.getCurriculums = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { search, tag, uploader, startDate, endDate } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Build query based on filters
    let query =
      "SELECT cf.*, u.name as uploader_name FROM curriculum_files cf JOIN users u ON cf.uploader_id = u.id";
    let countQuery = "SELECT COUNT(*) as total FROM curriculum_files cf";
    let queryParams = [];

    // Add WHERE clauses based on filters
    const whereConditions = [];

    if (search) {
      whereConditions.push("(cf.title LIKE ? OR cf.description LIKE ?)");
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (uploader) {
      whereConditions.push("cf.uploader_id = ?");
      queryParams.push(uploader);
    }

    if (startDate) {
      whereConditions.push("cf.created_at >= ?");
      queryParams.push(startDate);
    }

    if (endDate) {
      whereConditions.push("cf.created_at <= ?");
      queryParams.push(endDate);
    }

    // Add tag filter if provided
    if (tag) {
      query = `${query} JOIN file_tags ft ON cf.id = ft.file_id JOIN tags t ON ft.tag_id = t.id`;
      countQuery = `${countQuery} JOIN file_tags ft ON cf.id = ft.file_id JOIN tags t ON ft.tag_id = t.id`;
      whereConditions.push("t.name = ?");
      queryParams.push(tag);
    }

    // Combine where conditions if any
    if (whereConditions.length > 0) {
      const whereClause = "WHERE " + whereConditions.join(" AND ");
      query = `${query} ${whereClause}`;
      countQuery = `${countQuery} ${whereClause}`;
    }

    // Add ORDER BY and LIMIT
    query = `${query} ORDER BY cf.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    // Get total count for pagination
    db.get(countQuery, queryParams.slice(0, -2), (err, row) => {
      if (err) {
        console.error("Count query error:", err);
        return res
          .status(500)
          .json({ message: "Failed to retrieve curriculum files" });
      }

      const total = row ? row.total : 0;

      // Get files with pagination
      db.all(query, queryParams, async (err, files) => {
        if (err) {
          console.error("Query error:", err);
          return res
            .status(500)
            .json({ message: "Failed to retrieve curriculum files" });
        }

        // For each file, get its tags
        const filesWithTags = await Promise.all(
          files.map(async (file) => {
            return new Promise((resolve, reject) => {
              db.all(
                "SELECT t.name FROM tags t JOIN file_tags ft ON t.id = ft.tag_id WHERE ft.file_id = ?",
                [file.id],
                (err, tags) => {
                  if (err) {
                    console.error("Get tags error:", err);
                    return reject(err);
                  }

                  resolve({
                    id: file.id,
                    title: file.title,
                    description: file.description,
                    fileType: file.file_type,
                    fileId: file.file_id,
                    uploadDate: file.created_at,
                    uploader: {
                      id: file.uploader_id,
                      name: file.uploader_name,
                    },
                    tags: tags.map((tag) => tag.name),
                  });
                }
              );
            });
          })
        );

        res.json({
          files: filesWithTags,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        });
      });
    });
  } catch (error) {
    console.error("Get curriculums error:", error);
    res.status(500).json({ message: "Failed to retrieve curriculum files" });
  }
};

// Get a single curriculum file by ID
exports.getCurriculumById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get file details from database
    db.get(
      "SELECT cf.*, u.name as uploader_name FROM curriculum_files cf JOIN users u ON cf.uploader_id = u.id WHERE cf.id = ?",
      [id],
      async (err, file) => {
        if (err) {
          console.error("Query error:", err);
          return res
            .status(500)
            .json({ message: "Failed to retrieve curriculum file" });
        }

        if (!file) {
          return res.status(404).json({ message: "Curriculum file not found" });
        }

        // Get file tags
        db.all(
          "SELECT t.name FROM tags t JOIN file_tags ft ON t.id = ft.tag_id WHERE ft.file_id = ?",
          [id],
          async (err, tags) => {
            if (err) {
              console.error("Get tags error:", err);
              return res
                .status(500)
                .json({ message: "Failed to retrieve file tags" });
            }

            // Get file info from Google Drive
            try {
              const driveFile = await driveService.getFile(file.file_id);

              res.json({
                file: {
                  id: file.id,
                  title: file.title,
                  description: file.description,
                  fileType: file.file_type,
                  fileId: file.file_id,
                  uploadDate: file.created_at,
                  uploader: {
                    id: file.uploader_id,
                    name: file.uploader_name,
                  },
                  tags: tags.map((tag) => tag.name),
                  previewLink: driveFile.webViewLink,
                },
              });
            } catch (error) {
              console.error("Drive API error:", error);
              // Fall back to just the database info if Drive API fails
              res.json({
                file: {
                  id: file.id,
                  title: file.title,
                  description: file.description,
                  fileType: file.file_type,
                  fileId: file.file_id,
                  uploadDate: file.created_at,
                  uploader: {
                    id: file.uploader_id,
                    name: file.uploader_name,
                  },
                  tags: tags.map((tag) => tag.name),
                  previewLink: null,
                },
              });
            }
          }
        );
      }
    );
  } catch (error) {
    console.error("Get curriculum error:", error);
    res.status(500).json({ message: "Failed to retrieve curriculum file" });
  }
};

// Get a download URL for a curriculum file
exports.downloadCurriculum = async (req, res) => {
  try {
    const { id } = req.params;

    // Get file ID from database
    db.get(
      "SELECT file_id FROM curriculum_files WHERE id = ?",
      [id],
      async (err, file) => {
        if (err) {
          console.error("Query error:", err);
          return res
            .status(500)
            .json({ message: "Failed to retrieve curriculum file" });
        }

        if (!file) {
          return res.status(404).json({ message: "Curriculum file not found" });
        }

        // Generate download URL from Google Drive
        try {
          const downloadUrl = await driveService.generateDownloadUrl(
            file.file_id
          );
          res.json({ downloadUrl });
        } catch (error) {
          console.error("Generate download URL error:", error);
          res.status(500).json({ message: "Failed to generate download link" });
        }
      }
    );
  } catch (error) {
    console.error("Download curriculum error:", error);
    res.status(500).json({ message: "Failed to generate download link" });
  }
};

// Upload a new curriculum file
exports.uploadCurriculum = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided" });
    }

    const { title, description } = req.body;
    let tags = req.body.tags ? JSON.parse(req.body.tags) : [];

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Get file type from mimetype
    let fileType;
    switch (req.file.mimetype) {
      case "application/pdf":
        fileType = "pdf";
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        fileType = "docx";
        break;
      case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        fileType = "pptx";
        break;
      default:
        fileType = "unknown";
    }

    // Create file metadata for Drive
    const metadata = {
      title,
      description,
      tags: JSON.stringify(tags),
      uploaderId: req.user.id,
    };

    // Upload file to Google Drive
    const uploadedFile = await driveService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      metadata
    );

    // Insert file info into database
    db.run(
      "INSERT INTO curriculum_files (title, description, file_id, file_type, uploader_id) VALUES (?, ?, ?, ?, ?)",
      [title, description, uploadedFile.id, fileType, req.user.id],
      function (err) {
        if (err) {
          console.error("Database insert error:", err);
          return res
            .status(500)
            .json({ message: "Failed to save file metadata" });
        }

        const fileId = this.lastID;

        // Process tags
        if (tags.length > 0) {
          const processTagPromises = tags.map((tag) => {
            return new Promise((resolve, reject) => {
              // Check if tag exists
              db.get(
                "SELECT id FROM tags WHERE name = ?",
                [tag],
                (err, row) => {
                  if (err) {
                    console.error("Tag query error:", err);
                    return reject(err);
                  }

                  let tagId;

                  if (row) {
                    // Tag exists
                    tagId = row.id;
                    addFileTagRelation(fileId, tagId, resolve, reject);
                  } else {
                    // Create new tag
                    db.run(
                      "INSERT INTO tags (name) VALUES (?)",
                      [tag],
                      function (err) {
                        if (err) {
                          console.error("Tag insert error:", err);
                          return reject(err);
                        }

                        tagId = this.lastID;
                        addFileTagRelation(fileId, tagId, resolve, reject);
                      }
                    );
                  }
                }
              );
            });
          });

          // Wait for all tag processing to complete
          Promise.all(processTagPromises)
            .then(() => {
              returnFileResponse(fileId, req, res);
            })
            .catch((error) => {
              console.error("Tag processing error:", error);
              // Still return success for file upload, just log tag errors
              returnFileResponse(fileId, req, res);
            });
        } else {
          returnFileResponse(fileId, req, res);
        }
      }
    );
  } catch (error) {
    console.error("Upload curriculum error:", error);
    res.status(500).json({ message: "Failed to upload curriculum file" });
  }
};

// Function to add file-tag relation
function addFileTagRelation(fileId, tagId, resolve, reject) {
  db.run(
    "INSERT INTO file_tags (file_id, tag_id) VALUES (?, ?)",
    [fileId, tagId],
    (err) => {
      if (err) {
        console.error("File tag relation insert error:", err);
        return reject(err);
      }
      resolve();
    }
  );
}

// Function to return file response after upload
function returnFileResponse(fileId, req, res) {
  db.get(
    "SELECT cf.*, u.name as uploader_name FROM curriculum_files cf JOIN users u ON cf.uploader_id = u.id WHERE cf.id = ?",
    [fileId],
    (err, file) => {
      if (err) {
        console.error("Get file error:", err);
        return res
          .status(500)
          .json({ message: "Failed to retrieve uploaded file info" });
      }

      db.all(
        "SELECT t.name FROM tags t JOIN file_tags ft ON t.id = ft.tag_id WHERE ft.file_id = ?",
        [fileId],
        (err, tags) => {
          if (err) {
            console.error("Get tags error:", err);
            return res
              .status(500)
              .json({ message: "Failed to retrieve file tags" });
          }

          res.status(201).json({
            file: {
              id: file.id,
              title: file.title,
              description: file.description,
              fileType: file.file_type,
              fileId: file.file_id,
              uploadDate: file.created_at,
              uploader: {
                id: file.uploader_id,
                name: file.uploader_name,
              },
              tags: tags.map((tag) => tag.name),
            },
          });
        }
      );
    }
  );
}

exports.uploadCurriculum = async (req, res) => {
  try {
    // Mock implementation - actual implementation will upload to Google Drive
    const { title, description, tags } = req.body;

    // Mock response
    res.status(201).json({
      file: {
        id: Math.floor(Math.random() * 1000) + 1,
        title,
        description,
        tags: tags || [],
        uploadDate: new Date().toISOString(),
        uploader: {
          id: req.user.id,
          name: req.user.name,
        },
        fileId: `google-drive-file-id-${Date.now()}`,
      },
    });
  } catch (error) {
    console.error("Upload curriculum error:", error);
    res.status(500).json({ message: "Failed to upload curriculum file" });
  }
};

exports.updateCurriculum = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Get existing file to check ownership
    db.get(
      "SELECT * FROM curriculum_files WHERE id = ?",
      [id],
      async (err, file) => {
        if (err) {
          console.error("Query error:", err);
          return res
            .status(500)
            .json({ message: "Failed to retrieve curriculum file" });
        }

        if (!file) {
          return res.status(404).json({ message: "Curriculum file not found" });
        }

        // Check ownership or admin status
        // Get user role from role_id
        const roleMap = {
          1: "admin",
          2: "teacher",
          3: "student",
        };
        const userRole = roleMap[req.user.role_id];
        const isAdmin = userRole === "admin";

        if (file.uploader_id !== req.user.id && !isAdmin) {
          return res
            .status(403)
            .json({
              message: "You do not have permission to update this file",
            });
        }

        // Update file metadata in database
        db.run(
          "UPDATE curriculum_files SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
          [title, description, id],
          async function (err) {
            if (err) {
              console.error("Update error:", err);
              return res
                .status(500)
                .json({ message: "Failed to update curriculum file" });
            }

            // Handle tags if provided
            if (tags && Array.isArray(tags)) {
              // Delete existing tag associations
              db.run(
                "DELETE FROM file_tags WHERE file_id = ?",
                [id],
                async (err) => {
                  if (err) {
                    console.error("Delete tags error:", err);
                    // Continue with the update even if tag deletion fails
                  }

                  // Process new tags
                  const processTagPromises = tags.map((tag) => {
                    return new Promise((resolve, reject) => {
                      // Check if tag exists
                      db.get(
                        "SELECT id FROM tags WHERE name = ?",
                        [tag],
                        (err, row) => {
                          if (err) {
                            console.error("Tag query error:", err);
                            return reject(err);
                          }

                          let tagId;

                          if (row) {
                            // Tag exists
                            tagId = row.id;
                            addFileTagRelation(id, tagId, resolve, reject);
                          } else {
                            // Create new tag
                            db.run(
                              "INSERT INTO tags (name) VALUES (?)",
                              [tag],
                              function (err) {
                                if (err) {
                                  console.error("Tag insert error:", err);
                                  return reject(err);
                                }

                                tagId = this.lastID;
                                addFileTagRelation(id, tagId, resolve, reject);
                              }
                            );
                          }
                        }
                      );
                    });
                  });

                  try {
                    await Promise.all(processTagPromises);
                  } catch (error) {
                    console.error("Tag processing error:", error);
                    // Continue with the response even if there are tag errors
                  }
                }
              );
            }

            // Update metadata in Google Drive file properties
            try {
              console.log(`Updating file ${file.file_id} with metadata:`, {
                title,
                description,
                tags: JSON.stringify(tags || []),
              });

              await driveService.updateFileMetadata(file.file_id, {
                title,
                description,
                tags: JSON.stringify(tags || []),
              });
            } catch (driveError) {
              console.error("Drive update error:", driveError);
              // Continue with the response even if Drive update fails
            }

            returnFileResponse(id, req, res);
          }
        );
      }
    );
  } catch (error) {
    console.error("Update curriculum error:", error);
    res.status(500).json({ message: "Failed to update curriculum file" });
  }
};

exports.deleteCurriculum = async (req, res) => {
  try {
    const { id } = req.params;

    // Get the file details to verify ownership and get the Google Drive file ID
    db.get(
      "SELECT * FROM curriculum_files WHERE id = ?",
      [id],
      async (err, file) => {
        if (err) {
          console.error("Query error:", err);
          return res
            .status(500)
            .json({ message: "Failed to retrieve curriculum file" });
        }

        if (!file) {
          return res.status(404).json({ message: "Curriculum file not found" });
        }

        // Check ownership or admin status
        // Get user role from role_id
        const roleMap = {
          1: "admin",
          2: "teacher",
          3: "student",
        };
        const userRole = roleMap[req.user.role_id];
        const isAdmin = userRole === "admin";

        if (file.uploader_id !== req.user.id && !isAdmin) {
          return res
            .status(403)
            .json({
              message: "You do not have permission to delete this file",
            });
        }

        // Begin transaction for database operations
        db.serialize(() => {
          db.run("BEGIN TRANSACTION");

          // Delete tags associations first (foreign key constraint)
          db.run("DELETE FROM file_tags WHERE file_id = ?", [id], (err) => {
            if (err) {
              console.error("Delete tags error:", err);
              db.run("ROLLBACK");
              return res
                .status(500)
                .json({ message: "Failed to delete curriculum file" });
            }

            // Delete the file entry from the database
            db.run(
              "DELETE FROM curriculum_files WHERE id = ?",
              [id],
              async (err) => {
                if (err) {
                  console.error("Delete file error:", err);
                  db.run("ROLLBACK");
                  return res
                    .status(500)
                    .json({ message: "Failed to delete curriculum file" });
                }

                // Delete the file from Google Drive
                try {
                  console.log(
                    `Deleting file ${file.file_id} from Google Drive`
                  );
                  await driveService.deleteFile(file.file_id);
                  db.run("COMMIT");
                  res.json({ message: "Curriculum file deleted successfully" });
                } catch (driveError) {
                  console.error("Delete from Drive error:", driveError);
                  db.run("ROLLBACK");
                  res
                    .status(500)
                    .json({
                      message: "Failed to delete file from Google Drive",
                    });
                }
              }
            );
          });
        });
      }
    );
  } catch (error) {
    console.error("Delete curriculum error:", error);
    res.status(500).json({ message: "Failed to delete curriculum file" });
  }
};
