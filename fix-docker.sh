#!/bin/bash

# Fix Docker build issue by generating package-lock.json
echo "🔧 Fixing Docker build issue..."

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Run this script from the CurriculumBank root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected: A directory containing docker-compose.yml"
    exit 1
fi

# Navigate to frontend directory
cd frontend

# Check if Node.js and npm are available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   https://nodejs.org/en/download/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available. Please install npm first."
    exit 1
fi

# Generate package-lock.json if it doesn't exist
if [ ! -f "package-lock.json" ]; then
    echo "📦 Generating package-lock.json..."
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ package-lock.json generated successfully"
    else
        echo "❌ Failed to generate package-lock.json"
        echo "   Please run 'npm install' manually in the frontend directory"
        exit 1
    fi
else
    echo "✅ package-lock.json already exists"
fi

# Restore Dockerfile to use npm ci for better Docker layer caching
echo "🔄 Updating Dockerfile to use npm ci..."
if grep -q "RUN npm install" Dockerfile; then
    sed -i.bak 's/RUN npm install/RUN npm ci/' Dockerfile
    rm -f Dockerfile.bak
    echo "✅ Dockerfile updated to use npm ci"
else
    echo "✅ Dockerfile already uses npm ci"
fi

cd ..

echo ""
echo "🎉 Docker build issue fixed!"
echo ""
echo "Now you can run:"
echo "  docker-compose up --build"
echo ""
echo "Or test just the frontend:"
echo "  docker-compose build frontend"
echo ""
echo "Or start in development mode:"
echo "  ./simple-start.sh"
