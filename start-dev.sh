#!/bin/bash

# CurriculumBank Development Startup Script
echo "Starting CurriculumBank in development mode..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm and try again."
    exit 1
fi

# Start backend server
echo "Starting backend server..."
cd backend
npm install --silent
node src/index.js &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 3

# Test backend health
echo "Testing backend health..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✓ Backend is running successfully"
else
    echo "✗ Backend health check failed"
fi

# Start frontend server
echo "Starting frontend server..."
cd ../frontend
npm install --silent
npm start &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

echo ""
echo "Development servers are starting up..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop the servers, run:"
echo "kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop this script (servers will continue running)"

# Wait for user interrupt
trap "echo 'Script interrupted'; exit 0" INT
while true; do
    sleep 10
    # Check if processes are still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "Warning: Backend process has stopped"
    fi
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "Warning: Frontend process has stopped"
    fi
done
