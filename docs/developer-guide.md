# CurriculumnBank Developer Guide

## Getting Started

This guide will help you set up a development environment for the CurriculumnBank application.

### Prerequisites

- Node.js (v14+)
- npm (v6+)
- Git
- Google Cloud account (see `docs/google-api-setup.md`)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/CurriculumnBank.git
   cd CurriculumnBank
   ```

2. Install backend dependencies:

   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the backend folder by copying `.env.example`
   - Create a `.env` file in the frontend folder by copying `.env.example`
   - Update the values according to your setup (see Configuration section)

5. Set up Google API credentials (see `docs/google-api-setup.md`)

### Configuration

#### Backend Configuration

Create a `.env` file in the `backend` directory with the following content:

```
NODE_ENV=development
PORT=5000

# JWT Configuration
JWT_SECRET=your_jwt_secret_here_replace_in_production

# Google Drive API Configuration
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/credentials.json
GOOGLE_DRIVE_ROOT_FOLDER_ID=your_google_drive_folder_id

# Database Configuration
DB_PATH=db/curriculum_bank.sqlite
```

#### Frontend Configuration

Create a `.env` file in the `frontend` directory with the following content:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### Database Setup

The application uses SQLite for data storage. The database will be created automatically when you first run the backend server. No additional setup is needed.

### Running the Application

1. Start the backend server:

   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server:

   ```
   cd frontend
   npm start
   ```

3. The frontend application will be available at `http://localhost:3000`
4. The backend API will be available at `http://localhost:5000/api`

## Project Structure

### Backend

```
backend/
  ├── src/
  │   ├── index.js           # Entry point
  │   ├── config/            # Configuration files
  │   ├── controllers/       # Request handlers
  │   ├── database/          # Database connection and initialization
  │   ├── middleware/        # Express middleware
  │   ├── models/            # Data models
  │   ├── routes/            # API routes
  │   ├── services/          # Business logic
  │   └── utils/             # Utility functions
  ├── .env                   # Environment variables
  └── package.json           # Dependencies and scripts
```

### Frontend

```
frontend/
  ├── public/                # Static files
  ├── src/
  │   ├── assets/            # Images, fonts, etc.
  │   ├── components/        # React components
  │   ├── contexts/          # React contexts
  │   ├── services/          # API services
  │   ├── utils/             # Utility functions
  │   ├── App.js             # Main App component
  │   └── index.js           # Entry point
  ├── .env                   # Environment variables
  └── package.json           # Dependencies and scripts
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Google Sign-In authentication
- `GET /api/auth/me` - Get current user info

### Curriculum Files

- `POST /api/curriculums` - Upload new curriculum file
- `GET /api/curriculums` - List/search curriculum files
- `GET /api/curriculums/:id` - Get details and preview link
- `GET /api/curriculums/:id/download` - Download file
- `PUT /api/curriculums/:id` - Update file metadata
- `DELETE /api/curriculums/:id` - Delete file

### User Management

- `GET /api/users` - List users (admin only)
- `PUT /api/users/:id/role` - Update user role (admin only)

## Testing

### Backend Tests

Run backend tests:

```
cd backend
npm test
```

### Frontend Tests

Run frontend tests:

```
cd frontend
npm test
```

## Deployment

See the `docs/deployment.md` file for deployment instructions.
