@echo off
title Employee Dashboard - Complete Startup
echo.
echo ============================================
echo    Employee Dashboard - Complete Startup
echo ============================================
echo.
echo This will start all services for the Employee Dashboard:
echo  1. Backend Server (Node.js)
echo  2. Frontend Client (React)
echo  3. n8n Workflow Engine
echo.
echo Press any key to continue...
pause >nul
echo.

echo [1/3] Starting Backend Server...
start "Backend Server" cmd /k "cd server && powershell -ExecutionPolicy Bypass -Command \"node index.js\""
timeout /t 3 >nul

echo [2/3] Starting Frontend Client...
start "Frontend Client" cmd /k "cd client && powershell -ExecutionPolicy Bypass -Command \"npm start\""
timeout /t 3 >nul

echo [3/3] Starting n8n Workflow Engine...
start "n8n Workflow Engine" cmd /k "powershell -ExecutionPolicy Bypass -Command \"npx n8n\""

echo.
echo ============================================
echo    All Services Started Successfully!
echo ============================================
echo.
echo Access Points:
echo  - Dashboard:  http://localhost:3000
echo  - Backend:    http://localhost:5000
echo  - n8n:        http://localhost:5678
echo.
echo Three separate command windows have opened.
echo Close them individually to stop each service.
echo.
echo Press any key to exit this startup script...
pause >nul
