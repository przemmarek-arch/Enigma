@echo off
REM Enigma - Installation Script
REM This script downloads and installs Node.js if not already installed

echo.
echo ======================================
echo   Enigma Encryptor - Setup
echo ======================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Node.js nie jest zainstalowany
    echo [+] Pobieranie Node.js...
    
    REM Download Node.js LTS
    powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v18.18.0/node-v18.18.0-x64.msi' -OutFile 'node-installer.msi'"
    
    echo [+] Instalowanie Node.js...
    msiexec /i node-installer.msi /quiet
    
    REM Clean up installer
    del node-installer.msi
    
    echo [+] Node.js zainstalowany
    echo.
) else (
    echo [OK] Node.js znaleziony: 
    node --version
)

echo.
echo [+] Instalowanie zależności projektu...
call npm install

echo.
echo [OK] Setup ukończony!
echo.
echo Aby uruchomić aplikację:
echo   npm run electron-dev
echo.
pause
