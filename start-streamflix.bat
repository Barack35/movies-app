@echo off
cd /d "%~dp0"

:loop
netstat -ano | findstr :5173 | findstr LISTENING >nul 2>&1
if %errorlevel%==0 (
    echo Streamflix is already running at http://localhost:5173
    exit /b 0
)

echo Starting Streamflix dev server...
npm.cmd run dev >> dev.log 2>&1
echo Server stopped unexpectedly - restarting in 3 seconds...
timeout /t 3 /nobreak >nul
goto loop
