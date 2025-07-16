@echo off
echo Starting n8n Workflow Automation...
echo.
echo This will start n8n at http://localhost:5678
echo.
powershell -ExecutionPolicy Bypass -Command "npx n8n"
pause
