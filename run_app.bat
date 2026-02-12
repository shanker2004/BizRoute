@echo off
echo ==========================================
echo    BizRoute Quick Launcher 🚀
echo ==========================================

:: Check if orders.json exists, if not seed it
if not exist orders.json (
    echo [1/2] Seeding mock data...
    python seed_json.py
) else (
    echo [1/2] Mock data found.
)

echo [2/2] Starting Flask server (Mock Mode)...
echo.
echo Application will be available at: http://127.0.0.1:5000
echo.

python dev.py

pause
