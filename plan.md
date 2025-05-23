# Development Plan: CurriculumnBank

## 1. Project Setup (Week 1)

### Directory Structure
```
CurriculumnBank/
├── frontend/         # React application
├── backend/          # Node.js API server
├── docs/             # Documentation
├── .gitignore        # Git ignore file
├── README.md         # Project overview
├── spec.md           # Project specifications
└── plan.md           # This development plan
```

### Initial Setup Tasks
- Initialize Git repository
- Create frontend and backend directories
- Set up Node.js and npm environment
- Configure development tools (ESLint, Prettier)
- Configure Google Cloud project and enable APIs (Drive, Auth)

## 2. Backend Development (Weeks 2-3)

### Database Design
- Create SQLite database schema:
  - Users table (id, email, name, role_id, created_at, updated_at)
  - Roles table (id, name, permissions)
  - Curriculum files table (id, title, description, file_id, uploader_id, created_at, updated_at)
  - Tags table (id, name)
  - File_tags junction table (file_id, tag_id)

### API Development
1. **Authentication**
   - Set up Google OAuth 2.0 integration
   - Implement JWT token handling
   - Create authentication middleware

2. **Core API Endpoints**
   - `POST /api/auth/login` - Google Sign-In authentication
   - `GET /api/auth/me` - Get current user info
   - `POST /api/curriculums` - Upload new curriculum file
   - `GET /api/curriculums` - List/search curriculum files with filters
   - `GET /api/curriculums/:id` - Get details and preview link
   - `GET /api/curriculums/:id/download` - Download file
   - `PUT /api/curriculums/:id` - Update file metadata
   - `DELETE /api/curriculums/:id` - Delete file (for authorized users)
   - `GET /api/users` - List users (admin only)
   - `PUT /api/users/:id/role` - Update user role (admin only)

3. **Google Drive Integration**
   - Set up service account authentication
   - Implement file upload to specific Drive folder
   - Manage permissions on uploaded files
   - Generate secure download and preview links

4. **Testing**
   - Write unit tests for core functionality
   - Write integration tests for API endpoints

## 3. Frontend Development (Weeks 4-5)

### Core Components
1. **Authentication**
   - Google Sign-In component
   - Protected routes

2. **Navigation & Layout**
   - Responsive layout with header, sidebar, and main content
   - Role-based navigation menu

3. **Curriculum Management**
   - Upload form with metadata fields (title, description, tags)
   - List view with search and filters
   - Detail view with preview and download options
   - Tag management component

4. **Admin Panel**
   - User management interface
   - Role assignment interface

### State Management and API Integration
- Set up API service layer
- Implement state management (Context API or Redux)
- Handle file uploads with progress indicators

### Testing
- Component tests
- Integration tests for user flows

## 4. Integration & Testing (Week 6)

- End-to-end testing of complete user journeys
- Performance testing and optimization
- Security review and hardening
- Cross-browser testing

## 5. Deployment (Week 7)

### Backend Deployment
- Prepare Node.js application for production
- Set up environment variables
- Deploy to hosting service (e.g., Heroku, Render)

### Frontend Deployment
- Build production React application
- Deploy to hosting service (e.g., Netlify, Vercel)

### Database Setup
- Configure production SQLite instance or migrate to a more robust solution if needed

## 6. Documentation & User Guides (Week 7-8)

- Create administrator documentation
- Create teacher and student user guides
- Document API endpoints for potential future integrations

## 7. Future Enhancement Planning (Post-launch)

- Plan for implementing versioning of curriculum files
- Design notification system for new uploads
- Research LMS platforms for potential integration

## Implementation Milestones

1. **Alpha Release (End of Week 4)**
   - Basic authentication
   - File upload and download functionality
   - Simple listing interface

2. **Beta Release (End of Week 6)**
   - Complete feature set
   - Role-based permissions
   - Search and preview functionality

3. **Production Release (End of Week 8)**
   - Fully tested application
   - User documentation
   - Performance optimized

## Technologies

### Backend
- Node.js with Express
- SQLite for database
- Google Drive API
- OAuth 2.0 authentication

### Frontend
- React
- React Router
- Axios for API requests
- Material-UI or similar for UI components
- PDF.js or similar for document preview
