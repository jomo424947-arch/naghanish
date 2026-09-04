# Naghanish PowerShell Launcher
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  🧠 Naghanish - Launching Backend & Frontend" -ForegroundColor Yellow
Write-Host "===================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent

Write-Host "`n[1/2] Starting Frontend (Vite)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\frontend'; npm run dev"

Write-Host "[2/2] Starting Backend (FastAPI)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$scriptDir\backend'; python -m uvicorn app.main:app --reload --port 8000"

Start-Sleep -Seconds 3
Write-Host "`nOpening browser at http://localhost:3000 ..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host "`nAll systems launched successfully! 🎉" -ForegroundColor Green
