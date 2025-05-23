# CurriculumBank Deployment Guide

This guide provides instructions for deploying the CurriculumBank application in a production environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment](#deployment)
4. [Backup and Restore](#backup-and-restore)
5. [Updating](#updating)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying CurriculumBank, ensure you have the following:

- Docker and Docker Compose installed
- Google Cloud account with API services enabled
  - Google Drive API
  - Google OAuth 2.0
- Service account with appropriate permissions
- A domain name (optional, for production deployment)

## Environment Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/curriculum-bank.git
   cd curriculum-bank
   ```

2. Create an environment file:

   ```bash
   cp .env.example .env
   ```

3. Configure the following variables in `.env`:

   - `JWT_SECRET` - Secret key for JWT authentication
   - `GOOGLE_DRIVE_FOLDER_ID` - ID of the Google Drive folder for storing curriculum files
   - `GOOGLE_OAUTH_CLIENT_ID` - Google OAuth client ID
   - `GOOGLE_OAUTH_CLIENT_SECRET` - Google OAuth client secret
   - `GOOGLE_SERVICE_ACCOUNT_KEY` - Base64-encoded Google service account key

   For more information on setting up Google API credentials, refer to the [Google API Setup Guide](./docs/google-api-setup.md).

## Deployment

### Automatic Deployment

Run the deployment script:

```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:

1. Check for required environment variables
2. Build Docker images
3. Start the containers
4. Verify the deployment

### Manual Deployment

1. Build the Docker images:

   ```bash
   docker-compose build
   ```

2. Start the services:

   ```bash
   docker-compose up -d
   ```

3. Verify the services are running:
   ```bash
   docker-compose ps
   ```

## Backup and Restore

### Database Backup

Run the backup script to create a backup of the SQLite database:

```bash
chmod +x backup-db.sh
./backup-db.sh
```

Backups are stored in the `./backups` directory with timestamps.

### Database Restore

To restore a database backup:

```bash
docker-compose down
docker cp ./backups/curriculum_bank_YYYYMMDD_HHMMSS.db curriculum-bank-backend:/app/data/curriculum_bank.db
docker-compose up -d
```

## Updating

To update the application:

1. Pull the latest code:

   ```bash
   git pull
   ```

2. Rebuild and restart the containers:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

## Troubleshooting

### Viewing Logs

```bash
# View logs from all services
docker-compose logs

# View logs from a specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

### Common Issues

1. **Connection refused to backend**

   - Check if the backend container is running: `docker-compose ps`
   - Verify environment variables are correctly set
   - Check backend logs: `docker-compose logs backend`

2. **Authentication failure**

   - Ensure Google OAuth credentials are correct
   - Verify JWT_SECRET is consistent

3. **File upload issues**
   - Check Google Drive API permissions
   - Verify service account has write access to the specified folder

For more detailed troubleshooting, refer to the [Developer Guide](./docs/developer-guide.md).
