@echo off
title Naghanish Platform Launcher
color 0A
echo ===================================================
echo   🧠 Naghanish - Launching Backend & Frontend
echo ===================================================
echo.

if not exist "%~dp0frontend\node_modules" (
    echo [INFO] node_modules not found in frontend. Installing dependencies first...
    cd /d "%~dp0frontend"
    call npm install
    cd /d "%~dp0"
)

echo Starting Frontend (Vite React)...
start "Naghanish Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Starting Backend (FastAPI)...
start "Naghanish Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --reload --port 8000"

echo.
echo Waiting 3 seconds for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo ===================================================
echo  All systems running! 
echo  Frontend: http://localhost:3000
echo  Backend Docs: http://localhost:8000/api/docs
echo ===================================================
pause
