/**
 * Tests for the curriculum controller
 */

const { request, expect } = require("../testConfig");
const app = require("../../src/index");
const db = require("../../src/database");
const driveService = require("../../src/services/drive");

describe("Curriculum Controller", () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock database responses
    db.all.mockImplementation((query, params, callback) => {
      // Mock curriculum files
      const files = [
        {
          id: 1,
          title: "Math Curriculum",
          description: "Math curriculum for grade 10",
          file_id: "drive-file-id-1",
          file_type: "pdf",
          uploader_id: 1,
          uploader_name: "Admin User",
          created_at: "2025-05-20T10:00:00Z",
        },
        {
          id: 2,
          title: "Science Curriculum",
          description: "Science curriculum for grade 10",
          file_id: "drive-file-id-2",
          file_type: "docx",
          uploader_id: 2,
          uploader_name: "Teacher User",
          created_at: "2025-05-19T10:00:00Z",
        },
      ];

      // Mock tags
      const tags = [{ name: "math" }, { name: "science" }];

      // Return appropriate data based on query
      if (query.includes("COUNT(*)")) {
        callback(null, { total: 2 });
      } else if (query.includes("curriculum_files")) {
        callback(null, files);
      } else if (query.includes("tags")) {
        callback(null, tags);
      }
    });

    db.get.mockImplementation((query, params, callback) => {
      // Mock single file retrieval
      if (query.includes("curriculum_files") && params && params[0] === "1") {
        callback(null, {
          id: 1,
          title: "Math Curriculum",
          description: "Math curriculum for grade 10",
          file_id: "drive-file-id-1",
          file_type: "pdf",
          uploader_id: 1,
          uploader_name: "Admin User",
          created_at: "2025-05-20T10:00:00Z",
        });
      } else {
        callback(null, null);
      }
    });

    db.run.mockImplementation((query, params, callback) => {
      if (typeof callback === "function") {
        // Mock successful transaction
        callback.call({ lastID: 3, changes: 1 });
      }
    });
  });

  describe("GET /api/curriculums", () => {
    it("should return a list of curriculum files", async () => {
      const res = await request(app).get("/api/curriculums").expect(200);

      expect(res.body).to.have.property("files");
      expect(res.body.files).to.be.an("array");
      expect(res.body.files.length).to.equal(2);
      expect(res.body).to.have.property("pagination");
    });

    it("should filter curriculum files by search term", async () => {
      const res = await request(app)
        .get("/api/curriculums?search=Math")
        .expect(200);

      expect(db.all).to.have.been.called;
      // Further assertions would depend on the mock implementation
    });
  });

  describe("GET /api/curriculums/:id", () => {
    it("should return a single curriculum file", async () => {
      const res = await request(app).get("/api/curriculums/1").expect(200);

      expect(res.body).to.have.property("file");
      expect(res.body.file).to.have.property("id", 1);
      expect(res.body.file).to.have.property("title", "Math Curriculum");
    });

    it("should return 404 for non-existent file", async () => {
      db.get.mockImplementationOnce((query, params, callback) => {
        callback(null, null); // No file found
      });

      const res = await request(app).get("/api/curriculums/999").expect(404);

      expect(res.body).to.have.property("message", "Curriculum file not found");
    });
  });

  describe("POST /api/curriculums", () => {
    it("should create a new curriculum file", async () => {
      const res = await request(app)
        .post("/api/curriculums")
        .field("title", "New Curriculum")
        .field("description", "Test description")
        .field("tags", JSON.stringify(["test", "curriculum"]))
        .attach("file", Buffer.from("test file content"), "test.pdf")
        .expect(201);

      expect(driveService.uploadFile).to.have.been.called;
      expect(res.body).to.have.property("file");
      expect(res.body.file).to.have.property("title", "New Curriculum");
    });
  });

  describe("PUT /api/curriculums/:id", () => {
    it("should update a curriculum file", async () => {
      const res = await request(app)
        .put("/api/curriculums/1")
        .send({
          title: "Updated Curriculum",
          description: "Updated description",
          tags: ["updated", "test"],
        })
        .expect(200);

      expect(driveService.updateFileMetadata).to.have.been.called;
      expect(res.body).to.have.property("file");
      expect(res.body.file).to.have.property("id", 1);
    });
  });

  describe("DELETE /api/curriculums/:id", () => {
    it("should delete a curriculum file", async () => {
      const res = await request(app).delete("/api/curriculums/1").expect(200);

      expect(driveService.deleteFile).to.have.been.called;
      expect(res.body).to.have.property(
        "message",
        "Curriculum file deleted successfully"
      );
    });
  });
});
