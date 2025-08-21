@echo off
echo 🚀 Quick Start Setup for Chatty Web Architect
echo =============================================

echo.
echo 📋 Step 1: Setting up environment files...
if not exist "backend\.env" (
    copy "backend\env.config" "backend\.env"
    echo ✅ Backend .env created
) else (
    echo ℹ️  Backend .env already exists
)

if not exist ".env.local" (
    copy "env.local.config" ".env.local"
    echo ✅ Frontend .env.local created
) else (
    echo ℹ️  Frontend .env.local already exists
)

echo.
echo 📦 Step 2: Installing dependencies...
echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo Installing frontend dependencies...
call npm install

echo.
echo 🗄️  Step 3: Setting up database...
cd backend
echo Running database migrations...
call npm run migrate
cd ..

echo.
echo ⚠️  IMPORTANT: You need to add your OpenAI API key to backend\.env
echo    Replace "sk-your-openai-api-key-here" with your actual OpenAI API key
echo.

echo 🚀 Step 4: Starting the application...
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Starting frontend server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Setup complete! 
echo 🌐 Frontend: http://localhost:8080
echo 🔧 Backend: http://localhost:3001
echo.
echo ⚠️  Remember to add your OpenAI API key to backend\.env before using chat features!
echo.
pause 