#!/bin/bash

echo "🧪 Testing Docker build..."

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    echo ""
    echo "macOS: Open Docker Desktop from Applications"
    echo "Or run: open /Applications/Docker.app"
    exit 1
fi

echo "✅ Docker is running"

# Test frontend build specifically
echo "🔨 Testing frontend Docker build..."
if docker-compose build frontend; then
    echo "✅ Frontend Docker build successful!"
else
    echo "❌ Frontend Docker build failed!"
    echo ""
    echo "💡 Try running the fix script first:"
    echo "   ./fix-docker.sh"
    exit 1
fi

# Test full build
echo "🔨 Testing full Docker build..."
if docker-compose build; then
    echo "✅ Full Docker build successful!"
else
    echo "❌ Full Docker build failed!"
    exit 1
fi

echo ""
echo "🎉 All Docker builds successful!"
echo ""
echo "You can now run:"
echo "  docker-compose up -d"
echo ""
echo "Or with logs:"
echo "  docker-compose up"
