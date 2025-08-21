# Start Chatty Web Architect Application
Write-Host "Starting Chatty Web Architect..." -ForegroundColor Green

# Kill existing processes on the ports
Write-Host "Checking for existing processes..." -ForegroundColor Yellow
$backend = Get-Process | Where-Object {$_.ProcessName -eq "node"} | Where-Object {$_.MainWindowTitle -like "*backend*"}
$frontend = Get-Process | Where-Object {$_.ProcessName -eq "node"} | Where-Object {$_.MainWindowTitle -like "*frontend*"}

if ($backend) { $backend | Stop-Process -Force }
if ($frontend) { $frontend | Stop-Process -Force }

# Start backend
Write-Host "Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev" -WindowStyle Normal

# Wait and start frontend
Start-Sleep -Seconds 5
Write-Host "Starting frontend server..." -ForegroundColor Cyan  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Application started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:3001" -ForegroundColor Cyan
