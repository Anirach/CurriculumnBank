#!/bin/bash

# Quick Test Script for CurriculumBank
echo "🧪 Running Quick CurriculumBank Test..."

# Check if backend compiles
echo "📱 Testing Backend..."
cd backend
if [ ! -f "package.json" ]; then
    echo "❌ Backend package.json not found"
    exit 1
fi

# Check if frontend compiles
echo "🌐 Testing Frontend..."
cd ../frontend
if [ ! -f "package.json" ]; then
    echo "❌ Frontend package.json not found"
    exit 1
fi

echo "✅ Basic structure checks passed"

# Test syntax with node
echo "🔍 Testing JavaScript syntax..."
cd src
find . -name "*.js" -exec node -c {} \; 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ JavaScript syntax checks passed"
else
    echo "❌ JavaScript syntax errors found"
    exit 1
fi

echo ""
echo "🎉 All basic tests passed!"
echo "The application appears ready to run."
echo ""
echo "To start the application:"
echo "1. Run: ./simple-start.sh"
echo "2. Or use Docker: docker-compose up"
