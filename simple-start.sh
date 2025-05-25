#!/bin/bash

# CurriculumBank Simple Startup
echo "🎓 Starting CurriculumBank..."
echo ""

# Function to check if port is in use
check_port() {
    lsof -ti:$1 >/dev/null 2>&1
}

# Function to start backend
start_backend() {
    echo "🔧 Starting Backend Server..."
    cd backend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        npm install
    fi
    
    # Start backend server
    npm start &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    
    # Wait a moment and check if it's running
    sleep 3
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "✅ Backend started on http://localhost:5000"
        return 0
    else
        echo "❌ Backend failed to start"
        return 1
    fi
}

# Function to start frontend
start_frontend() {
    echo ""
    echo "🎨 Starting Frontend Server..."
    cd ../frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    
    # Start frontend server
    npm start &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    
    echo "✅ Frontend starting on http://localhost:3000"
    return 0
}

# Check for port conflicts
if check_port 5000; then
    echo "⚠️  Port 5000 is already in use. Please stop the conflicting process."
    lsof -ti:5000 | xargs ps -p
    exit 1
fi

if check_port 3000; then
    echo "⚠️  Port 3000 is already in use. Please stop the conflicting process."
    lsof -ti:3000 | xargs ps -p
    exit 1
fi

# Start services
cd /Users/anirachmingkhwan/Code/CurriculumnBank

if start_backend; then
    if start_frontend; then
        echo ""
        echo "🚀 CurriculumBank is starting up!"
        echo "================================"
        echo ""
        echo "📱 Access URLs:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend:  http://localhost:5000/api"
        echo "   Health:   http://localhost:5000/api/health"
        echo ""
        echo "🔧 Process IDs:"
        echo "   Backend:  $BACKEND_PID"
        echo "   Frontend: $FRONTEND_PID"
        echo ""
        echo "🛑 To stop the servers:"
        echo "   kill $BACKEND_PID $FRONTEND_PID"
        echo ""
        echo "Press Ctrl+C to stop this script (servers will continue running)"
        
        # Keep script running and monitor processes
        trap "echo ''; echo 'Script stopped. Servers are still running.'; exit 0" INT
        while true; do
            sleep 10
            if ! kill -0 $BACKEND_PID 2>/dev/null; then
                echo "⚠️  Backend process stopped"
                break
            fi
            if ! kill -0 $FRONTEND_PID 2>/dev/null; then
                echo "⚠️  Frontend process stopped"
                break
            fi
        done
    fi
fi
