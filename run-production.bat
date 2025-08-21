@echo off
title Chatty Web Architect - Production Server
color 0A

echo ===============================================
echo    CHATTY WEB ARCHITECT - PRODUCTION READY
echo ===============================================
echo.

echo [1/4] Setting up environment...
if not exist "backend\.env" (
    echo Creating backend environment...
    (
        echo PORT=3001
        echo NODE_ENV=production
        echo DB_TYPE=sqlite
        echo OPENAI_API_KEY=sk-your-openai-api-key-here
        echo JWT_SECRET=production-jwt-secret-key-12345
        echo JWT_EXPIRES_IN=7d
        echo CORS_ORIGIN=http://localhost:8080
        echo RATE_LIMIT_WINDOW=15
        echo RATE_LIMIT_MAX_REQUESTS=100
        echo MAX_FILE_SIZE=10485760
        echo UPLOAD_PATH=./uploads
    ) > backend\.env
    echo ✓ Backend environment configured
)

if not exist ".env.local" (
    echo Creating frontend environment...
    (
        echo VITE_BACKEND_URL=http://localhost:3001
        echo VITE_JWT_EXPIRY=3600
        echo VITE_APP_ENV=production
    ) > .env.local
    echo ✓ Frontend environment configured
)

echo.
echo [2/4] Installing dependencies...
cd backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install --silent --production
)
cd ..

if not exist "node_modules" (
    echo Installing frontend dependencies...
    npm install --silent --production
)

echo.
echo [3/4] Setting up database...
if not exist "backend\data" mkdir backend\data
echo ✓ Database directory ready

echo.
echo [4/4] Starting services...
echo.
echo ============================================
echo    SERVICES STARTING - DO NOT CLOSE
echo ============================================
echo.
echo Frontend: http://localhost:8080
echo Backend:  http://localhost:3001
echo Health:   http://localhost:3001/health
echo API Docs: http://localhost:3001/api/docs
echo.
echo Press Ctrl+C to stop all services
echo.

start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "npm run dev"

echo ✓ Both services started successfully!
echo ✓ Application is ready for use!
echo.
echo Your full-stack application is now running!
pause
