# 🐳 Docker Setup Instructions for CurriculumBank

## Current Issue Resolution

You encountered these errors:

- `Cannot connect to the Docker daemon` - Docker Desktop is not running
- `npm ci can only install packages with an existing package-lock.json` - Missing lockfile
- Environment variable warnings - Missing configuration

## Quick Fix Steps

### 1. Start Docker Desktop

**Option A: Using Spotlight**

1. Press `Cmd + Space` (Spotlight)
2. Type "Docker" and press Enter
3. Wait for Docker to start (whale icon in menu bar should be stable)

**Option B: Using Finder**

1. Open Finder
2. Go to Applications
3. Double-click "Docker"
4. Wait for startup to complete

**Verify Docker is Running:**

```bash
docker --version
docker info
```

### 2. Fix Docker Build Issue

The frontend Docker build fails because `package-lock.json` is missing:

```bash
# Quick fix - run the automated script
./fix-docker.sh

# OR manual fix:
cd frontend
npm install  # This generates package-lock.json
cd ..
```

### 3. Start the Application

Once Docker is running, try again:

```bash
# Navigate to project directory
cd /Users/anirachmingkhwan/Code/CurriculumnBank

# Start with Docker (recommended for production-like experience)
docker-compose up -d

# OR start in development mode (if Docker issues persist)
./simple-start.sh
```

## Alternative: Development Mode

If Docker continues to have issues, use development mode:

```bash
# Use the simple startup script
./simple-start.sh

# OR manual startup:
# Terminal 1 - Backend
cd backend && npm install && npm start

# Terminal 2 - Frontend
cd frontend && npm install && npm start
```

## Access Points

| Mode            | Frontend              | Backend                   | Health Check                     |
| --------------- | --------------------- | ------------------------- | -------------------------------- |
| **Docker**      | http://localhost      | http://localhost:5000/api | http://localhost:5000/api/health |
| **Development** | http://localhost:3000 | http://localhost:5000/api | http://localhost:5000/api/health |

## Troubleshooting

### Frontend Build Fails - Missing package-lock.json

**Error:** `npm ci can only install packages with an existing package-lock.json`

**Solution:**

```bash
# Use the automated fix script
./fix-docker.sh

# OR manual fix:
cd frontend
npm install
cd ..
docker-compose build frontend
```

### Docker Desktop Not Starting

- **macOS Intel**: Ensure you downloaded the Intel version
- **macOS Apple Silicon**: Ensure you downloaded the Apple Silicon version
- **Resources**: Check if you have enough free disk space and RAM
- **Restart**: Try restarting Docker Desktop

### Port Conflicts

```bash
# Check what's using the ports
lsof -ti:80 -ti:5000 -ti:3000

# Kill conflicting processes
sudo kill -9 $(lsof -ti:80)  # If port 80 is in use
```

### Environment Variables

The application uses these default values for development:

- `JWT_SECRET`: Development secret (secure in production)
- `GOOGLE_OAUTH_CLIENT_ID`: Development client ID
- `GOOGLE_DRIVE_FOLDER_ID`: Development folder ID

## Production Deployment

For production, ensure you:

1. Update all environment variables with real values
2. Use proper Google API credentials
3. Set secure JWT secrets
4. Configure proper domain and SSL

## Getting Help

1. **Check logs**:

   ```bash
   # Docker mode
   docker-compose logs -f

   # Development mode
   # Check terminal output where servers are running
   ```

2. **Test health endpoint**:

   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Verify setup**:
   ```bash
   ./verify-app.sh
   ```
