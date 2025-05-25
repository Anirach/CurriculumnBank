#!/bin/bash

# CurriculumBank Quick Start Guide
echo "🎓 CurriculumBank Quick Start Guide"
echo "===================================="

# Check if Docker is installed and running
echo ""
echo "1. Checking Docker availability..."
if command -v docker &> /dev/null; then
    echo "✓ Docker is installed"
    
    # Check if Docker daemon is running
    if docker info &> /dev/null; then
        echo "✓ Docker daemon is running"
        DOCKER_AVAILABLE=true
    else
        echo "⚠️  Docker daemon is not running"
        echo ""
        echo "To start Docker:"
        echo "   1. Open Docker Desktop application"
        echo "   2. Wait for it to start completely"
        echo "   3. Run this script again"
        echo ""
        echo "If Docker Desktop is not installed:"
        echo "   Download from: https://www.docker.com/products/docker-desktop"
        DOCKER_AVAILABLE=false
    fi
else
    echo "❌ Docker is not installed"
    echo "   Download from: https://www.docker.com/products/docker-desktop"
    DOCKER_AVAILABLE=false
fi

# Check environment variables
echo ""
echo "2. Checking environment configuration..."
if [ -f ".env" ]; then
    echo "✓ Environment file (.env) exists"
    
    # Check for required variables
    source .env 2>/dev/null
    
    if [ -n "$JWT_SECRET" ]; then
        echo "✓ JWT_SECRET is configured"
    else
        echo "⚠️  JWT_SECRET is missing"
    fi
    
    if [ -n "$GOOGLE_OAUTH_CLIENT_ID" ]; then
        echo "✓ Google OAuth Client ID is configured"
    else
        echo "⚠️  GOOGLE_OAUTH_CLIENT_ID is missing"
    fi
    
    if [ -n "$GOOGLE_DRIVE_FOLDER_ID" ]; then
        echo "✓ Google Drive Folder ID is configured"
    else
        echo "⚠️  GOOGLE_DRIVE_FOLDER_ID is missing"
    fi
else
    echo "❌ Environment file (.env) not found"
    echo "   Creating from template..."
    cp .env.example .env
    echo "✓ Created .env file from template"
    echo "   Please edit .env with your Google API credentials"
fi

echo ""
echo "3. Starting Application..."
echo "=========================="

if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "🐳 Starting with Docker..."
    echo ""
    echo "Building and starting containers..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Application started successfully!"
        echo ""
        echo "🌐 Access URLs:"
        echo "   Frontend:  http://localhost"
        echo "   Backend:   http://localhost:5000/api"
        echo "   Health:    http://localhost:5000/api/health"
        echo ""
        echo "📋 Container Status:"
        docker-compose ps
        echo ""
        echo "📝 View logs:"
        echo "   docker-compose logs -f"
        echo ""
        echo "🛑 Stop application:"
        echo "   docker-compose down"
    else
        echo "❌ Failed to start with Docker"
        echo "Falling back to development mode..."
        DOCKER_AVAILABLE=false
    fi
fi

if [ "$DOCKER_AVAILABLE" = false ]; then
    echo "🔧 Starting in development mode..."
    echo ""
    
    # Check Node.js
    if command -v node &> /dev/null; then
        echo "✓ Node.js is available"
        
        # Check if start-dev.sh exists and is executable
        if [ -x "./start-dev.sh" ]; then
            echo "🚀 Starting development servers..."
            ./start-dev.sh
        else
            echo "📝 Manual setup required:"
            echo ""
            echo "Backend setup:"
            echo "   cd backend"
            echo "   npm install"
            echo "   npm start"
            echo ""
            echo "Frontend setup (in new terminal):"
            echo "   cd frontend"
            echo "   npm install"
            echo "   npm start"
            echo ""
            echo "Access URLs:"
            echo "   Frontend: http://localhost:3000"
            echo "   Backend:  http://localhost:5000"
        fi
    else
        echo "❌ Node.js is not installed"
        echo "   Download from: https://nodejs.org/"
        echo ""
        echo "Or install with Homebrew:"
        echo "   brew install node"
    fi
fi

echo ""
echo "📚 Documentation:"
echo "   Deployment Guide: docs/deployment-guide.md"
echo "   User Manual:      docs/user-manual.md"
echo "   Admin Manual:     docs/admin-manual.md"
echo ""
echo "🆘 Need help? Check the docs/ directory or README.md"
