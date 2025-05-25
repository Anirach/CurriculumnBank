# 🎓 CurriculumBank

A comprehensive Google Drive-based curriculum management system for educational institutions, built with modern web technologies and enterprise-grade features.

![CurriculumBank](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-v18+-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![Tests](https://img.shields.io/badge/Tests-Comprehensive-green)

## 🌟 Features

### Core Functionality

- 📁 **Google Drive Integration** - Seamless file storage and management
- 🔐 **Google OAuth Authentication** - Secure user authentication
- 👥 **Role-Based Access Control** - Admin and User roles with permissions
- 📚 **Curriculum Management** - Upload, edit, delete, and organize curricula
- 🔍 **Advanced Search & Filtering** - Find curricula by title, tags, and metadata
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

### Admin Features

- 👨‍💼 **User Management** - Add, edit, and manage user accounts
- 📊 **Dashboard Analytics** - Overview of system usage and statistics
- 🏷️ **Tag Management** - Organize curricula with custom tags
- 🔧 **System Configuration** - Manage application settings

### Developer Features

- 🧪 **Comprehensive Testing** - Unit, integration, and component tests
- 🐳 **Docker Support** - Containerized deployment
- 🚀 **CI/CD Pipeline** - Automated testing and deployment
- 📖 **Complete Documentation** - Setup, usage, and API documentation

## 🛠️ Technology Stack

| Component          | Technology                   | Version |
| ------------------ | ---------------------------- | ------- |
| **Backend**        | Node.js + Express.js         | v18+    |
| **Frontend**       | React.js                     | v18+    |
| **Database**       | SQLite                       | v5+     |
| **Authentication** | Google OAuth 2.0             | Latest  |
| **Storage**        | Google Drive API             | v3      |
| **Testing**        | Jest + React Testing Library | Latest  |
| **Deployment**     | Docker + Docker Compose      | Latest  |
| **CI/CD**          | GitHub Actions               | Latest  |

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Docker (optional, for containerized deployment)
- Google Cloud Platform account for API access

### Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CurriculumnBank
   ```

2. **Quick start (automated)**

   ```bash
   ./start-dev.sh
   ```

3. **Manual setup**

   ```bash
   # Install backend dependencies
   cd backend
   npm install
   cp .env.example .env
   # Configure your .env file

   # Install frontend dependencies
   cd ../frontend
   npm install
   cp .env.example .env
   # Configure your .env file
   ```

4. **Start development servers**

   ```bash
   # Backend (Terminal 1)
   cd backend && npm run dev

   # Frontend (Terminal 2)
   cd frontend && npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

### Production Deployment

**Using Docker Compose (Recommended)**

```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configure production values in .env files
# Start the application
docker-compose up -d

# Access at http://localhost
```

**Manual Deployment**

```bash
# Build and deploy
./deploy.sh

# Or step by step:
cd backend && npm install --production
cd ../frontend && npm run build
# Configure web server (nginx/apache) to serve build files
```

## 🧪 Testing

### Run All Tests

```bash
./run-tests.sh
```

### Individual Test Suites

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Watch mode for development
cd frontend && npm test -- --watch
```

### Test Coverage

- **Backend**: Unit tests for controllers, services, and middleware
- **Frontend**: Component tests for all major UI components
- **Integration**: End-to-end authentication and API flows
- **Error Handling**: Comprehensive error scenario testing

## 📁 Project Structure

```
CurriculumnBank/
├── 📂 backend/                 # Express.js API server
│   ├── 📂 src/
│   │   ├── 📂 controllers/     # Route handlers and business logic
│   │   ├── 📂 middleware/      # Authentication and validation
│   │   ├── 📂 routes/          # API endpoint definitions
│   │   ├── 📂 database/        # Database setup and migrations
│   │   ├── 📂 services/        # External service integrations
│   │   └── 📄 index.js         # Application entry point
│   ├── 📂 tests/               # Backend test suites
│   ├── 📄 Dockerfile           # Backend container configuration
│   └── 📄 package.json         # Dependencies and scripts
├── 📂 frontend/                # React.js application
│   ├── 📂 src/
│   │   ├── 📂 components/      # Reusable UI components
│   │   ├── 📂 contexts/        # React context providers
│   │   ├── 📂 services/        # API service layer
│   │   └── 📂 utils/           # Utility functions
│   ├── 📂 tests/               # Frontend test suites
│   ├── 📄 Dockerfile           # Frontend container configuration
│   └── 📄 package.json         # Dependencies and scripts
├── 📂 docs/                    # Comprehensive documentation
│   ├── 📄 deployment-guide.md  # Deployment instructions
│   ├── 📄 user-manual.md       # End-user guide
│   ├── 📄 admin-manual.md      # Administrator guide
│   └── 📄 developer-guide.md   # Development guidelines
├── 📂 .github/workflows/       # CI/CD automation
├── 📄 docker-compose.yml       # Multi-container orchestration
├── 📄 .env.example             # Environment configuration template
└── 📄 *.sh                     # Deployment and utility scripts
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**

```bash
NODE_ENV=production
PORT=5000
JWT_SECRET=your_secure_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_DRIVE_ROOT_FOLDER_ID=your_drive_folder_id
DB_PATH=db/curriculum_bank.sqlite
```

**Frontend (.env)**

```bash
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

### Google API Setup

1. Create a Google Cloud Platform project
2. Enable Google Drive API and Google+ API
3. Create OAuth 2.0 credentials
4. Configure authorized redirect URIs
5. See `docs/google-api-setup.md` for detailed instructions

## 📚 Documentation

| Document                                     | Description                          |
| -------------------------------------------- | ------------------------------------ |
| [Deployment Guide](docs/deployment-guide.md) | Step-by-step deployment instructions |
| [User Manual](docs/user-manual.md)           | End-user guide with screenshots      |
| [Admin Manual](docs/admin-manual.md)         | Administrator functionality guide    |
| [Developer Guide](docs/developer-guide.md)   | Code contribution guidelines         |
| [Testing Guide](docs/testing-guide.md)       | Testing procedures and examples      |
| [Google API Setup](docs/google-api-setup.md) | Google API configuration             |

## 🔒 Security

- **Authentication**: Google OAuth 2.0 integration
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Input validation and sanitization
- **Secure Headers**: Helmet.js security middleware
- **Environment Security**: Environment-based configuration
- **API Security**: JWT token-based API authentication

## 🚦 API Endpoints

### Authentication

- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Curricula

- `GET /api/curriculums` - List curricula (with pagination/filtering)
- `POST /api/curriculums` - Upload new curriculum
- `GET /api/curriculums/:id` - Get curriculum details
- `PUT /api/curriculums/:id` - Update curriculum
- `DELETE /api/curriculums/:id` - Delete curriculum

### Users (Admin only)

- `GET /api/users` - List users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Health Check

- `GET /api/health` - Application health status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [Developer Guide](docs/developer-guide.md) for detailed contribution guidelines.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For support and questions:

1. Check the [documentation](docs/)
2. Review [common issues](docs/troubleshooting.md)
3. Create an issue on GitHub
4. Contact the development team

## 🎉 Acknowledgments

- Google Drive API for seamless file management
- React.js community for excellent documentation
- Jest and React Testing Library for robust testing tools
- Docker for containerization simplicity

---

**Status**: ✅ Production Ready | **Version**: 1.0.0 | **Last Updated**: May 2025
