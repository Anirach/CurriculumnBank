# Specification: CurriculumnBank

## Overview

CurriculumnBank is a system designed to **store**, **retrieve**, and **view** curriculum files that are stored in Google Drive. The system provides a user-friendly interface for managing curriculum documents, ensuring secure access and efficient organization.

---

## Functional Requirements

### 1. Store Curriculum Files

- **Upload Interface:**  
  Users can upload curriculum files (PDF, DOCX, etc.) via a web interface.
- **Google Drive Integration:**  
  Uploaded files are stored in a designated Google Drive folder using the Google Drive API.
- **Metadata Storage:**  
  For each file, store metadata (title, description, tags, upload date, uploader info) in a database.

### 2. Retrieve Curriculum Files

- **Search & Filter:**  
  Users can search for curriculum files by keywords, tags, uploader, or date.
- **List View:**  
  Display a paginated list of available curriculum files with metadata.
- **Download:**  
  Users can download files directly from Google Drive via secure links.

### 3. View Curriculum Files

- **Preview:**  
  Users can preview curriculum files (PDF, DOCX) in-browser without downloading.
- **Details Page:**  
  Each file has a details page showing metadata and preview.

---

## Non-Functional Requirements

- **Authentication:**  
  Only authenticated users can upload, view, or download files.
- **Authorization:**  
  Role-based access (e.g., admin, teacher, student) to control upload and view permissions.
- **Security:**  
  Secure file access using Google Drive permissions and application-level checks.
- **Performance:**  
  Fast search and retrieval, even with large numbers of files.
- **Scalability:**  
  Support for growing numbers of users and curriculum files.

---

## Technical Requirements

- **Frontend:**  
  Web application (React) for user interaction.
- **Backend:**  
  RESTful API (Node.js) to handle business logic and Google Drive integration.
- **Database:**  
  Store file metadata in sqlite.
- **Google Drive API:**  
  For file storage, retrieval, and permission management.
- **Authentication:**  
  OAuth 2.0 (Google Sign-In or similar).

---

## User Stories

1. **As a teacher, I want to upload curriculum files so that others can access them.**
2. **As a student, I want to search and view curriculum files relevant to my courses.**
3. **As an admin, I want to manage user roles and permissions.**
4. **As a user, I want to preview files before downloading.**

---

## API Endpoints (Sample)

- `POST /api/curriculums` — Upload a new curriculum file
- `GET /api/curriculums` — List/search curriculum files
- `GET /api/curriculums/:id` — Get details and preview link
- `GET /api/curriculums/:id/download` — Download file

---

## Integration with Google Drive

- Use service accounts or delegated user authentication for Drive access.
- Store only file IDs and metadata in the database.
- Use Drive permissions to restrict file access.

---

## Future Enhancements

- Versioning of curriculum files
- Notifications for new uploads
- Integration with LMS platforms

---