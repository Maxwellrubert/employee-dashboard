@echo off
echo Starting Employee Dashboard Frontend...
cd client

echo Checking dependencies...
powershell -ExecutionPolicy Bypass -Command "npm install"

echo Starting client...
powershell -ExecutionPolicy Bypass -Command "npm start"
pause
