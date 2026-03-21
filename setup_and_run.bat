@echo off
setlocal enabledelayedexpansion

echo ==========================================
echo    BizRoute Unified Installer & Runner 🚀
echo ==========================================

:: 1. Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.x to continue.
    pause
    exit /b 1
)
echo [1/5] Python found.

:: 2. Install main app dependencies
echo [2/5] Installing main app dependencies...
python -m pip install -r requirements.txt

:: 3. Seed mock data if needed
if not exist orders.json (
    echo [3/5] Seeding mock data...
    python seed_json.py
) else (
    echo [3/5] Mock data found.
)

:: 4. Check for Node.js or Bun
echo [4/5] Checking for package manager...
where bun >nul 2>1
if %errorlevel% eq 0 (
    echo [4/5] Bun found.
    echo [5/5] Installing Business Module dependencies with Bun...
    cd business_module
    call bun install
    cd ..
) else (
    where node >nul 2>&1
    if %errorlevel% neq 0 (
        echo [WARNING] Neither Bun nor Node.js is installed. Business Module will not run.
    ) else (
        echo [4/5] Node.js found.
        echo [5/5] Installing Business Module dependencies with npm...
        cd business_module
        call npm install
        cd ..
    )
)

echo.
echo ==========================================
echo    Starting Servers...
echo ==========================================
echo Main App: http://localhost:5001
echo Business Module: http://localhost:3000
echo ==========================================
echo.

:: Run both in separate windows
start cmd /k "echo Starting Flask Server... && python app.py"
if exist business_module\node_modules (
    where bun >nul 2>1
    if %errorlevel% eq 0 (
        start cmd /k "cd business_module && echo Starting Business Module (Vite) with Bun... && bun run dev"
    ) else (
        start cmd /k "cd business_module && echo Starting Business Module (Vite) with npm... && npm run dev"
    )
)

echo Both servers are starting. You can close this window.
pause
