#!/bin/bash
# Start ReelSense++ Backend Server

echo "============================================================"
echo "🎬 ReelSense++ Backend Server"
echo "============================================================"

cd "$(dirname "$0")"

# Check if virtual environment exists
if [ ! -d "../.venv" ]; then
    echo "❌ Virtual environment not found at ../.venv"
    echo "Please create it first: python -m venv ../.venv"
    exit 1
fi

# Activate virtual environment and start server
echo "🚀 Starting backend server..."
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Windows
    ../.venv/Scripts/python.exe app.py
else
    # Linux/Mac  
    ../.venv/bin/python app.py
fi