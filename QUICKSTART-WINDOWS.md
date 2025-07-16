# Quick Start Guide for Employee Dashboard

## 🚨 PowerShell Execution Policy Fix

If you're getting PowerShell execution policy errors, here are **3 solutions**:

### Solution 1: Use the Fixed Batch Files (Recommended)
Choose one of these options:

**Option A - Start Everything at Once:**
- Double-click `start-all.bat` - Starts backend, frontend, AND n8n

**Option B - Start Services Individually:**
- `start-server.bat` - Starts the backend
- `start-client.bat` - Starts the frontend  
- `start-n8n.bat` - Starts n8n workflow engine

These now include the PowerShell bypass command for all npm/npx commands.

### Solution 2: Use the PowerShell Script
Run this command in PowerShell (as Administrator if needed):
```powershell
powershell -ExecutionPolicy Bypass -File start-dashboard.ps1
```

### Solution 3: Temporarily Change Execution Policy
1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Type `Y` to confirm
4. Now you can use `npm start` normally

### Solution 4: Manual Start (Always Works)
Open 3 separate terminals and run:

**Terminal 1 - Backend:**
```bash
cd server
node index.js
```

**Terminal 2 - Frontend:**
```bash
cd client
powershell -ExecutionPolicy Bypass -Command "npm start"
```

**Terminal 3 - n8n:**
```bash
powershell -ExecutionPolicy Bypass -Command "npx n8n"
```

## 🎯 Quick Test Steps

1. **Start Backend**: Use any method above
2. **Start Frontend**: Use any method above  
3. **Test Dashboard**: Go to http://localhost:3000
4. **Test API**: Go to http://localhost:5000/api/health
5. **Setup n8n**: Run `npx n8n` and go to http://localhost:5678

## 🔍 Troubleshooting

- **Port 3000 in use**: Kill any running React apps
- **Port 5000 in use**: Kill any running Node apps  
- **Dependencies missing**: Run `powershell -ExecutionPolicy Bypass -Command "npm install"` in each folder
- **Still having issues**: Use Solution 4 (Manual Start) above

## ✅ Success Indicators

You'll know everything is working when:
- ✅ Backend shows: "Server running on port 5000"
- ✅ Frontend opens browser to http://localhost:3000
- ✅ Dashboard shows employee statistics
- ✅ You can add/edit/delete employees

Happy coding! 🚀
