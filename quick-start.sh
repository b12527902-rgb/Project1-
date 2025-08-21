#!/bin/bash

echo "🚀 Quick Start Setup for Chatty Web Architect"
echo "============================================="

echo ""
echo "📋 Step 1: Setting up environment files..."

if [ ! -f "backend/.env" ]; then
    cp backend/env.config backend/.env
    echo "✅ Backend .env created"
else
    echo "ℹ️  Backend .env already exists"
fi

if [ ! -f ".env.local" ]; then
    cp env.local.config .env.local
    echo "✅ Frontend .env.local created"
else
    echo "ℹ️  Frontend .env.local already exists"
fi

echo ""
echo "📦 Step 2: Installing dependencies..."
echo "Installing backend dependencies..."
cd backend && npm install && cd ..

echo "Installing frontend dependencies..."
npm install

echo ""
echo "🗄️  Step 3: Setting up database..."
cd backend
echo "Running database migrations..."
npm run migrate
cd ..

echo ""
echo "⚠️  IMPORTANT: You need to add your OpenAI API key to backend/.env"
echo "   Replace 'sk-your-openai-api-key-here' with your actual OpenAI API key"
echo ""

echo "🚀 Step 4: Starting the application..."
echo "Starting backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

echo "Waiting 5 seconds for backend to start..."
sleep 5

echo "Starting frontend server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Setup complete!"
echo "🌐 Frontend: http://localhost:8080"
echo "🔧 Backend: http://localhost:3001"
echo ""
echo "⚠️  Remember to add your OpenAI API key to backend/.env before using chat features!"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop
wait 