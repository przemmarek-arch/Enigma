#!/bin/bash
# Enigma - Installation Script for macOS and Linux

echo ""
echo "======================================"
echo "  Enigma Encryptor - Setup"
echo "======================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[!] Node.js nie jest zainstalowany"
    echo "[+] Instalowanie Node.js..."
    
    # Use nvm for better Node.js management
    if [ "$(uname)" = "Darwin" ]; then
        # macOS
        brew install node
    else
        # Linux
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    echo "[+] Node.js zainstalowany"
    echo ""
else
    echo "[OK] Node.js znaleziony:"
    node --version
fi

echo ""
echo "[+] Instalowanie zależności projektu..."
npm install

echo ""
echo "[OK] Setup ukończony!"
echo ""
echo "Aby uruchomić aplikację:"
echo "  npm run electron-dev"
echo ""
