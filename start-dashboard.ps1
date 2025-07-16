# Employee Dashboard Startup Script
Write-Host "🚀 Starting Employee Dashboard..." -ForegroundColor Green
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Function to start a process in a new window
function Start-ProcessInNewWindow {
    param($Title, $Command, $WorkingDirectory)
    
    Write-Host "🔄 Starting $Title..." -ForegroundColor Yellow
    
    $startInfo = New-Object System.Diagnostics.ProcessStartInfo
    $startInfo.FileName = "powershell.exe"
    $startInfo.Arguments = "-ExecutionPolicy Bypass -NoExit -Command `"cd '$WorkingDirectory'; $Command`""
    $startInfo.WorkingDirectory = $WorkingDirectory
    $startInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Normal
    
    try {
        $process = [System.Diagnostics.Process]::Start($startInfo)
        Write-Host "✅ $Title started successfully" -ForegroundColor Green
        return $process
    }
    catch {
        Write-Host "❌ Failed to start $Title" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        return $null
    }
}

# Start backend server
$serverPath = Join-Path $PWD "server"
$backendProcess = Start-ProcessInNewWindow "Backend Server" "node index.js" $serverPath

Start-Sleep -Seconds 2

# Start frontend
$clientPath = Join-Path $PWD "client"
$frontendProcess = Start-ProcessInNewWindow "Frontend Client" "npm start" $clientPath

Start-Sleep -Seconds 2

# Start n8n
$n8nProcess = Start-ProcessInNewWindow "n8n Workflow Engine" "npx n8n" $PWD

Write-Host ""
Write-Host "🎉 Employee Dashboard is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access Points:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   n8n:      http://localhost:5678" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Please wait a moment for all services to fully start..." -ForegroundColor Yellow
Write-Host ""
Write-Host "🔴 To stop: Close the backend, frontend, and n8n terminal windows" -ForegroundColor Red
Write-Host ""
Write-Host "Press any key to exit this startup script..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
