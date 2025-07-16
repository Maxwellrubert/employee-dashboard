@echo off
echo Starting Employee Dashboard Backend Server...
cd server

echo Checking dependencies...
powershell -ExecutionPolicy Bypass -Command "npm install"

echo Starting server...
powershell -ExecutionPolicy Bypass -Command "node index.js"
pause
