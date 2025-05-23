#!/bin/bash
# Run all tests for CurriculumBank

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting CurriculumBank test suite...${NC}"

# Run backend tests
echo -e "${YELLOW}Running backend tests...${NC}"
cd backend
npm test
BACKEND_EXIT_CODE=$?
cd ..

# Run frontend tests
echo -e "${YELLOW}Running frontend tests...${NC}"
cd frontend
npm test -- --watchAll=false
FRONTEND_EXIT_CODE=$?
cd ..

# Report results
echo
echo -e "${YELLOW}Test Results Summary:${NC}"
echo -e "-------------------"

if [ $BACKEND_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}Backend tests: PASSED${NC}"
else
  echo -e "${RED}Backend tests: FAILED (Exit code: $BACKEND_EXIT_CODE)${NC}"
fi

if [ $FRONTEND_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}Frontend tests: PASSED${NC}"
else
  echo -e "${RED}Frontend tests: FAILED (Exit code: $FRONTEND_EXIT_CODE)${NC}"
fi

# Set the final exit code
if [ $BACKEND_EXIT_CODE -eq 0 ] && [ $FRONTEND_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}All tests passed successfully!${NC}"
  exit 0
else
  echo -e "${RED}Some tests failed. Please check the output above for details.${NC}"
  exit 1
fi
