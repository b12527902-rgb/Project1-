@echo off
echo ===========================================
echo    Chatty Web Application Startup
echo ===========================================
echo.

echo [1/2] Starting Backend Server...
start "Chatty Backend" cmd /k "cd /d %~dp0backend && npm run dev"

echo [2/2] Starting Frontend Server...
timeout /t 3 /nobreak > nul
start "Chatty Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ===========================================
echo    Both servers are starting up!
echo ===========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo.
echo NOTE: You need to add your OpenAI API key to backend\.env
echo       to enable chat features!
echo.
echo Press any key to close this window...
pause > nul
