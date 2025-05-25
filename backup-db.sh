#!/bin/bash
# Backup script for CurriculumBank SQLite database

# Exit immediately if a command exits with a non-zero status
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get timestamp for backup filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backups"
DB_CONTAINER="curriculum-bank-backend"
DB_PATH="/app/data/curriculum_bank.db"
BACKUP_FILE="${BACKUP_DIR}/curriculum_bank_${TIMESTAMP}.db"

echo -e "${YELLOW}Starting database backup...${NC}"

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Check if the container is running
if ! docker ps | grep -q ${DB_CONTAINER}; then
  echo -e "${RED}Error: Backend container is not running!${NC}"
  echo -e "${YELLOW}Starting containers...${NC}"
  docker-compose up -d
  sleep 5
fi

# Copy the SQLite database file from the container
echo -e "${YELLOW}Copying database from container...${NC}"
docker cp ${DB_CONTAINER}:${DB_PATH} ${BACKUP_FILE}

# Verify backup was successful
if [ -f "${BACKUP_FILE}" ]; then
  echo -e "${GREEN}Backup successful: ${BACKUP_FILE}${NC}"
  # Keep only the last 10 backups
  ls -tp ${BACKUP_DIR}/curriculum_bank_*.db | grep -v '/$' | tail -n +11 | xargs -I {} rm -- {}
  echo -e "${GREEN}Cleanup completed. Keeping the last 10 backups.${NC}"
else
  echo -e "${RED}Backup failed!${NC}"
  exit 1
fi
