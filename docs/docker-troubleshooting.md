# Docker Troubleshooting Guide for CurriculumBank

## Issue: Docker Daemon Not Running

**Error Message:**

```
Cannot connect to the Docker daemon at unix:///Users/.../docker.sock. Is the docker daemon running?
```

### Solution:

1. **Install Docker Desktop** (if not installed):

   - Download from: https://www.docker.com/products/docker-desktop
   - Follow the installation instructions for macOS

2. **Start Docker Desktop**:

   - Open Docker Desktop application from Applications folder
   - Wait for the Docker icon in the menu bar to show as running (green)
   - You should see "Docker Desktop is running" in the menu

3. **Verify Docker is running**:
   ```bash
   docker --version
   docker info
   ```

## Issue: Environment Variables Not Set

**Error Message:**

```
WARN[0000] The "JWT_SECRET" variable is not set. Defaulting to a blank string.
```

### Solution:

1. **Check if .env file exists**:

   ```bash
   ls -la .env
   ```

2. **Create .env file from template**:

   ```bash
   cp .env.example .env
   ```

3. **Edit .env file with your values**:
   ```bash
   # Required variables in .env:
   JWT_SECRET="your_jwt_secret_here"
   GOOGLE_OAUTH_CLIENT_ID="your_google_client_id"
   GOOGLE_OAUTH_CLIENT_SECRET="your_google_client_secret"
   GOOGLE_DRIVE_FOLDER_ID="your_drive_folder_id"
   GOOGLE_SERVICE_ACCOUNT_KEY="base64_encoded_service_account_key"
   ```

## Issue: Docker Compose Version Warning

**Error Message:**

```
the attribute `version` is obsolete, it will be ignored
```

### Solution:

This warning is harmless with newer Docker Compose versions. The version field has been removed from the docker-compose.yml file.

## Issue: Port Already in Use

**Error Message:**

```
Error starting userland proxy: listen tcp 0.0.0.0:80: bind: address already in use
```

### Solution:

1. **Check what's using the port**:

   ```bash
   sudo lsof -i :80
   sudo lsof -i :5000
   ```

2. **Stop conflicting services**:

   ```bash
   # Stop Apache (if running)
   sudo apachectl stop

   # Stop nginx (if running)
   sudo nginx -s stop
   ```

3. **Use different ports** (edit docker-compose.yml):
   ```yaml
   frontend:
     ports:
       - "8080:80" # Use port 8080 instead of 80
   backend:
     ports:
       - "127.0.0.1:5001:5000" # Use port 5001 instead of 5000
   ```

## Issue: Container Build Failures

### Solution:

1. **Clean Docker cache**:

   ```bash
   docker system prune -a
   ```

2. **Rebuild containers**:

   ```bash
   docker-compose build --no-cache
   docker-compose up -d
   ```

3. **Check build logs**:
   ```bash
   docker-compose build --progress=plain
   ```

## Quick Start Commands

### Development Mode (without Docker):

```bash
./start-dev.sh
```

### Production Mode (with Docker):

```bash
# First time setup
cp .env.example .env
# Edit .env file with your values

# Start application
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop application
docker-compose down
```

### Verification:

```bash
./quick-start.sh
```

## Getting Help

1. **Check container logs**:

   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

2. **Access container shell**:

   ```bash
   docker-compose exec backend /bin/bash
   docker-compose exec frontend /bin/bash
   ```

3. **Check container health**:

   ```bash
   docker-compose ps
   curl http://localhost:5000/api/health
   ```

4. **Restart specific service**:
   ```bash
   docker-compose restart backend
   docker-compose restart frontend
   ```

## Alternative: Development Mode

If Docker continues to have issues, you can run the application in development mode:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm start

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```
