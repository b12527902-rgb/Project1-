# Fixed Start Script for Chatty Web Architect
Write-Host "🚀 Starting Chatty Web Architect with fixed port configuration..." -ForegroundColor Green

# Check if ports are in use and kill existing processes
$backendPid = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
$frontendPid = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess

if ($backendPid) {
    Write-Host "Stopping existing backend process on port 3001..." -ForegroundColor Yellow
    Stop-Process -Id $backendPid -Force -ErrorAction SilentlyContinue
}

if ($frontendPid) {
    Write-Host "Stopping existing frontend process on port 5173..." -ForegroundColor Yellow
    Stop-Process -Id $frontendPid -Force -ErrorAction SilentlyContinue
}

Start-Sleep -Seconds 2

# Start backend server
Write-Host "Starting backend server on port 3001..." -ForegroundColor Cyan
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev" -WindowStyle Normal -PassThru

# Wait for backend to start
Start-Sleep -Seconds 5

# Test backend connection
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method Get -TimeoutSec 5
    Write-Host "✅ Backend health check passed" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend may still be starting..." -ForegroundColor Yellow
}

# Start frontend server
Write-Host "Starting frontend server on port 5173..." -ForegroundColor Cyan
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev" -WindowStyle Normal -PassThru

Start-Sleep -Seconds 5

# Test frontend connection  
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -Method Get -TimeoutSec 10
    Write-Host "✅ Frontend server is responding" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Frontend may still be starting..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Application startup complete!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan  
Write-Host "🔧 Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:3001/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Configuration Details:" -ForegroundColor Yellow
Write-Host "- Backend port fixed from 3100 → 3001" -ForegroundColor White
Write-Host "- Frontend port set to 5173 (Vite default)" -ForegroundColor White
Write-Host "- CORS configured for both ports" -ForegroundColor White
Write-Host "- Environment variables aligned" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
