@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js is required. Install it from https://nodejs.org then try again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing dependencies - this only happens once.
  call npm install
)
echo Starting BMY Collection at http://localhost:8080
call npm run dev
pause
