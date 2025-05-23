# CurriculumBank

A system designed to store, retrieve, and view curriculum files stored in Google Drive.

## Overview

CurriculumBank provides a user-friendly interface for managing curriculum documents, ensuring secure access and efficient organization. It integrates with Google Drive for file storage while maintaining metadata and access control in its own database.

## Features

- **Store**: Upload curriculum files (PDF, DOCX, etc.) via a web interface.
- **Retrieve**: Search and filter curriculum files by keywords, tags, uploader, or date.
- **View**: Preview curriculum files in-browser without downloading.
- **Secure Access**: Role-based permissions (admin, teacher, student).
- **Google Drive Integration**: Leverage Google Drive for reliable file storage.
- **User Management**: Admin interface for managing user roles and permissions.
- **Responsive Design**: Works on desktop, tablet, and mobile devices.

## Technology Stack

- **Frontend**: React with Material-UI
- **Backend**: Node.js with Express
- **Database**: SQLite
- **Authentication**: Google OAuth 2.0
- **File Storage**: Google Drive API
- **Containerization**: Docker and Docker Compose
- **Testing**: Jest and React Testing Library

## Quick Start

### Development Environment

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/curriculum-bank.git
   cd curriculum-bank
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the backend:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. Start the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

### Production Deployment

For production deployment, use Docker:

```bash
# Set up environment variables
cp .env.example .env
# Edit .env with your production configuration

# Run the deployment script
chmod +x deploy.sh
./deploy.sh
```

For detailed deployment instructions, see the [Deployment Guide](docs/deployment-guide.md).

## Testing

### Running Backend Tests

```bash
cd backend
npm test
```

### Running Frontend Tests

```bash
cd frontend
npm test
```

For detailed testing instructions, see the [Testing Guide](docs/testing-guide.md).

## Documentation

- [Project Specification](spec.md)
- [Development Plan](plan.md)
- [Developer Guide](docs/developer-guide.md)
- [Deployment Guide](docs/deployment-guide.md)
- [Testing Guide](docs/testing-guide.md)
- [Google API Setup Guide](docs/google-api-setup.md)
