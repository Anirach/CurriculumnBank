#!/bin/bash
# Update script for CurriculumBank

# Exit immediately if a command exits with a non-zero status
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting CurriculumBank update...${NC}"

# Check if Docker and Docker Compose are installed
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
  echo -e "${RED}Error: Docker and/or Docker Compose are not installed!${NC}"
  exit 1
fi

# Back up the database before updating
echo -e "${YELLOW}Backing up the database...${NC}"
./backup-db.sh

# Pull latest code if in a git repository
if [ -d ".git" ]; then
  echo -e "${YELLOW}Pulling latest code from repository...${NC}"
  git pull
fi

# Stop the running containers
echo -e "${YELLOW}Stopping running containers...${NC}"
docker-compose down

# Rebuild the Docker images
echo -e "${YELLOW}Rebuilding Docker images...${NC}"
docker-compose build

# Start the containers with the updated images
echo -e "${YELLOW}Starting containers with updated images...${NC}"
docker-compose up -d

# Wait for services to start
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
  echo -e "${GREEN}Update successful! CurriculumBank is now running with the latest changes.${NC}"
  echo -e "${GREEN}Frontend: http://localhost${NC}"
  echo -e "${GREEN}Backend API: http://localhost/api${NC}"
else
  echo -e "${RED}Update failed! Please check the logs with: docker-compose logs${NC}"
  exit 1
fi
