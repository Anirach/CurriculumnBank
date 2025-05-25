#!/bin/bash

# CurriculumBank Application Verification Script
echo "==========================================="
echo "CurriculumBank Application Verification"
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success_count=0
total_checks=0

check_result() {
    total_checks=$((total_checks + 1))
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        success_count=$((success_count + 1))
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

echo ""
echo "1. Checking Prerequisites..."
echo "------------------------------"

# Check Node.js
node --version > /dev/null 2>&1
check_result $? "Node.js is installed"

# Check npm
npm --version > /dev/null 2>&1
check_result $? "npm is available"

# Check project structure
[ -d "backend" ] && [ -d "frontend" ]
check_result $? "Project structure exists"

echo ""
echo "2. Checking Backend..."
echo "----------------------"

cd backend

# Check package.json
[ -f "package.json" ]
check_result $? "Backend package.json exists"

# Check main files
[ -f "src/index.js" ]
check_result $? "Backend index.js exists"

# Check environment file
[ -f ".env" ]
check_result $? "Backend .env file exists"

# Install dependencies
npm install --silent > /dev/null 2>&1
check_result $? "Backend dependencies installed"

# Syntax check
node -c src/index.js > /dev/null 2>&1
check_result $? "Backend syntax is valid"

# Create database directory
mkdir -p db
check_result $? "Database directory created"

# Start server temporarily
echo "Testing backend startup..."
timeout 10s node src/index.js > server_test.log 2>&1 &
SERVER_PID=$!
sleep 3

# Check if server started
if kill -0 $SERVER_PID 2>/dev/null; then
    check_result 0 "Backend server starts successfully"
    
    # Test health endpoint
    curl -s http://localhost:5000/api/health > /dev/null 2>&1
    check_result $? "Backend health endpoint responds"
    
    # Stop server
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null
else
    check_result 1 "Backend server starts successfully"
fi

cd ..

echo ""
echo "3. Checking Frontend..."
echo "-----------------------"

cd frontend

# Check package.json
[ -f "package.json" ]
check_result $? "Frontend package.json exists"

# Check main files
[ -f "src/App.js" ]
check_result $? "Frontend App.js exists"

# Check environment file
[ -f ".env" ]
check_result $? "Frontend .env file exists"

# Install dependencies
npm install --silent > /dev/null 2>&1
check_result $? "Frontend dependencies installed"

# Build check
npm run build > /dev/null 2>&1
check_result $? "Frontend builds successfully"

cd ..

echo ""
echo "4. Checking Documentation..."
echo "----------------------------"

# Check documentation files
[ -d "docs" ]
check_result $? "Documentation directory exists"

[ -f "docs/deployment-guide.md" ]
check_result $? "Deployment guide exists"

[ -f "docs/user-manual.md" ]
check_result $? "User manual exists"

[ -f "docs/admin-manual.md" ]
check_result $? "Admin manual exists"

echo ""
echo "5. Checking Deployment Configuration..."
echo "---------------------------------------"

# Check Docker files
[ -f "docker-compose.yml" ]
check_result $? "Docker Compose configuration exists"

[ -f "backend/Dockerfile" ]
check_result $? "Backend Dockerfile exists"

[ -f "frontend/Dockerfile" ]
check_result $? "Frontend Dockerfile exists"

# Check deployment scripts
[ -f "deploy.sh" ]
check_result $? "Deployment script exists"

[ -f "backup-db.sh" ]
check_result $? "Backup script exists"

[ -f "update.sh" ]
check_result $? "Update script exists"

[ -f "run-tests.sh" ]
check_result $? "Test runner script exists"

echo ""
echo "6. Checking CI/CD Configuration..."
echo "----------------------------------"

[ -f ".github/workflows/ci-cd.yml" ]
check_result $? "GitHub Actions workflow exists"

echo ""
echo "7. Running Tests..."
echo "-------------------"

# Backend tests
cd backend
if [ -d "tests" ]; then
    npm test > /dev/null 2>&1
    check_result $? "Backend tests pass"
else
    check_result 1 "Backend tests directory exists"
fi
cd ..

# Frontend tests
cd frontend
if [ -d "src/tests" ]; then
    npm test -- --watchAll=false > /dev/null 2>&1
    check_result $? "Frontend tests pass"
else
    check_result 1 "Frontend tests directory exists"
fi
cd ..

echo ""
echo "==========================================="
echo "Verification Summary"
echo "==========================================="
echo "Checks passed: $success_count / $total_checks"

if [ $success_count -eq $total_checks ]; then
    echo -e "${GREEN}🎉 All checks passed! The application is ready.${NC}"
    echo ""
    echo "To start the application:"
    echo "  Development mode: ./start-dev.sh"
    echo "  Production mode: docker-compose up"
    echo ""
    echo "Access points:"
    echo "  Frontend: http://localhost:3000"
    echo "  Backend API: http://localhost:5000/api"
    echo "  Health check: http://localhost:5000/api/health"
    exit 0
else
    echo -e "${RED}❌ Some checks failed. Please review the issues above.${NC}"
    exit 1
fi
