#!/bin/bash

echo "=========================================="
echo "   BizRoute Unified Installer & Runner 🚀"
echo "=========================================="

# 1. Check for Python
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "[ERROR] Python is not installed or not in PATH."
    echo "Please install Python 3.x to continue."
    exit 1
fi

echo "[1/5] Python found: $($PYTHON_CMD --version)"

# Optional: Create and activate virtual environment
if [ ! -d "venv" ]; then
    echo "[2/5] Creating virtual environment (venv)..."
    $PYTHON_CMD -m venv venv
fi
# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
fi

# 2. Install main app dependencies
echo "[2/5] Installing main app dependencies..."
$PYTHON_CMD -m pip install -r requirements.txt

# 3. Seed mock data if needed
if [ ! -f "orders.json" ]; then
    echo "[3/5] Seeding mock data..."
    $PYTHON_CMD seed_json.py
else
    echo "[3/5] Mock data found."
fi

# 4. Check for Node.js or Bun
echo "[4/5] Checking for package manager..."
if command -v bun &> /dev/null; then
    echo "[4/5] Bun found."
    echo "[5/5] Installing Business Module dependencies with Bun..."
    cd business_module || exit
    bun install
    cd ..
elif command -v node &> /dev/null; then
    echo "[4/5] Node.js found."
    echo "[5/5] Installing Business Module dependencies with npm..."
    cd business_module || exit
    npm install
    cd ..
else
    echo "[WARNING] Neither Bun nor Node.js is installed. Business Module will not run."
fi

echo ""
echo "=========================================="
echo "   Starting Servers..."
echo "=========================================="
echo "Main App: http://localhost:5001"
echo "Business Module: http://localhost:3000"
echo "=========================================="
echo ""

# Run both servers in the background
echo "Starting Flask Server in the background..."
$PYTHON_CMD app.py &
FLASK_PID=$!

if [ -d "business_module/node_modules" ]; then
    cd business_module || exit
    if command -v bun &> /dev/null; then
        echo "Starting Business Module (Vite) with Bun in the background..."
        bun run dev &
        VITE_PID=$!
    else
        echo "Starting Business Module (Vite) with npm in the background..."
        npm run dev &
        VITE_PID=$!
    fi
    cd ..
fi

echo ""
echo "Both servers are running concurrently in this terminal window."
echo "Press [Ctrl+C] to stop both servers and exit."

# Wait for background processes and elegantly kill both on exit/Ctrl+C
trap "echo -e '\nStopping servers...'; kill $FLASK_PID $VITE_PID 2>/dev/null; exit" INT TERM EXIT
wait
