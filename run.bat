@echo off

:: Change to the script's directory first
cd /d "%~dp0"

:: Now change to the geargod subdirectory
cd geargod
echo Checking GearGod directory: %cd%

:: Check if node_modules exists to ensure dependencies are installed
if not exist node_modules\ (
    echo Node modules not found. Installing dependencies...
    goto :install_deps
) else (
    echo Dependencies found. Starting application...
    goto :run_app
)

:install_deps
:: Ensure npm is available
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: npm is not installed or not in PATH.
    pause
    exit /b 1
)

:: Check if package.json exists
if not exist package.json (
    echo Error: package.json not found in %cd%
    pause
    exit /b 1
)

:: Initialize npm and install dependencies
echo Installing dependencies...
npm install --save ^
    @headlessui/react@2.2.0 ^
    @heroicons/react@2.2.0 ^
    @heroui/react@2.7.2 ^
    @iconify/react@5.2.0 ^
    @tailwindcss/cli@4.0.9 ^
    bcryptjs@3.0.2 ^
    lucide-react@0.475.0 ^
    next@15.1.7 ^
    next-auth@4.24.11 ^
    react@19.0.0 ^
    react-dom@19.0.0 ^
    react-router-dom@7.2.0 ^
    sqlite@5.1.1 ^
    sqlite3@5.1.7

npm install --save-dev ^
    @eslint/eslintrc@3 ^
    @types/node@20 ^
    @types/react@19 ^
    @types/react-dom@19 ^
    eslint@9 ^
    eslint-config-next@15.1.7 ^
    postcss@8 ^
    tailwindcss@3.4.17 ^
    typescript@5

echo Dependencies installed successfully.
echo.

:run_app
:: Start the development server
echo Starting GearGod application in development mode...
npm run dev

:: If npm run dev exits, keep the console window open
echo.
echo Application exited or encountered an error.
pause