@echo off
color a
echo Starting Backend and Frontend servers...

start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"
start "Frontend Server" cmd /k "cd /d %~dp0 && npm run dev"

echo Both servers are starting...
echo Backend: http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo NOTE: You need to add your OpenAI API key to backend\.env before using chat features!
pause
