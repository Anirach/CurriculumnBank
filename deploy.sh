#!/bin/bash
# Deployment script for CurriculumBank

# Exit immediately if a command exits with a non-zero status
set -e

# Print each command before executing it
set -x

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting CurriculumBank deployment...${NC}"

# Check if .env file exists, if not create it from example
if [ ! -f ".env" ]; then
  echo -e "${YELLOW}Creating .env file from .env.example...${NC}"
  cp .env.example .env
  echo -e "${RED}Please update the .env file with your actual configurations before continuing!${NC}"
  echo -e "${RED}Press any key to continue after updating the .env file...${NC}"
  read -n 1 -s
fi

# Load environment variables
source .env

# Verify required environment variables
required_vars=(
  "JWT_SECRET"
  "GOOGLE_DRIVE_FOLDER_ID"
  "GOOGLE_OAUTH_CLIENT_ID"
  "GOOGLE_OAUTH_CLIENT_SECRET"
  "GOOGLE_SERVICE_ACCOUNT_KEY"
)

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo -e "${RED}Error: ${var} is not set in the .env file!${NC}"
    exit 1
  fi
done

# Build and start containers
echo -e "${YELLOW}Building and starting Docker containers...${NC}"
docker-compose build
docker-compose up -d

# Wait for services to start
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
  echo -e "${GREEN}Deployment successful! CurriculumBank is now running.${NC}"
  echo -e "${GREEN}Frontend: http://localhost${NC}"
  echo -e "${GREEN}Backend API: http://localhost/api${NC}"
else
  echo -e "${RED}Deployment failed! Please check the logs with: docker-compose logs${NC}"
  exit 1
fi
