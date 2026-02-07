@echo off
REM Start ReelSense++ Backend Server

echo ============================================================
echo 🎬 ReelSense++ Backend Server
echo ============================================================

cd /d "%~dp0"

REM Check if virtual environment exists
if not exist "..\\.venv" (
    echo ❌ Virtual environment not found at ..\.venv
    echo Please create it first: python -m venv ..\.venv
    pause
    exit /b 1
)

REM Start backend server
echo 🚀 Starting backend server...
"..\.venv\Scripts\python.exe" app.py

pause