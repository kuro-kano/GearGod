@echo off

:: Change to the script's directory
cd /d "%~dp0"

:: Change to the geargod directory
cd geargod

:: Check if node_modules exists to ensure dependencies are installed
if not exist node_modules\ (
    echo Error: Dependencies not installed. Please run install.bat first.
    exit /b 1
)

:: Start the development server
echo Starting GearGod application in development mode...
npm run dev

:: If npm run dev exits, keep the console window open
pause