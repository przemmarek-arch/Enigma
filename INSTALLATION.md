# INSTALLATION.md - Instrukcja instalacji Enigma

## 📋 Wymagania wstępne

Przed uruchomieniem Enigma, musisz mieć zainstalowany **Node.js 14.0** lub wyższy.

## 🚀 Szybka instalacja

### Opcja 1: Automatyczna instalacja (Windows)

1. Dwukrotnie kliknij plik `setup.bat` w folderze projektu
2. Skrypt automatycznie zainstaluje Node.js (jeśli go nie ma) i zależności

### Opcja 2: Automatyczna instalacja (macOS/Linux)

```bash
chmod +x setup.sh
./setup.sh
```

### Opcja 3: Manualna instalacja

#### Krok 1: Instalacja Node.js

**Windows:**
- Pobierz z https://nodejs.org/ (LTS verzja)
- Uruchom instalator i postępuj zgodnie z instrukcjami

**macOS:**
```bash
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install nodejs npm
```

#### Krok 2: Weryfikacja instalacji

```bash
node --version   # powinno wyświetlić v14.0.0 lub wyżej
npm --version    # powinno wyświetlić 6.0.0 lub wyżej
```

#### Krok 3: Instalacja zależności projektu

```bash
cd Enigma
npm install
```

## 🎮 Uruchomienie aplikacji

### Tryb deweloperski (z dev tools):

```bash
npm run electron-dev
```

### Tryb produkcyjny:

```bash
npm run build
npm run electron
```

### Budowanie instalatora:

```bash
npm run electron-build
```

Instalator powstanie w folderze `dist/`

## 🔍 Rozwiązywanie problemów

### Problem: "npm: command not found"

**Rozwiązanie:** Node.js nie jest zainstalowany lub nie jest w PATH
- Zainstaluj Node.js z https://nodejs.org/
- Uruchom ponownie terminal/PowerShell

### Problem: "npm install" zawiesza się

**Rozwiązanie:** Wyczyść cache npm
```bash
npm cache clean --force
npm install
```

### Problem: Port 3000 jest już w użyciu

**Rozwiązanie:** 
```bash
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000
```

Następnie zabij proces lub użyj innego portu:
```bash
PORT=3001 npm run electron-dev
```

## 📦 Struktura folderów po instalacji

```
Enigma/
├── node_modules/          # (tworzy się po npm install)
├── public/
│   ├── electron.js
│   ├── preload.js
│   └── index.html
├── src/
│   ├── components/
│   └── App.js
├── build/                 # (tworzy się po budowaniu)
├── dist/                  # (tworzy się po npm run electron-build)
├── package.json
├── tailwind.config.js
└── README.md
```

## ✅ Weryfikacja poprawnej instalacji

Po `npm install`, powinno być:

```bash
✓ node_modules/ folder
✓ package-lock.json plik
✓ electron w node_modules
✓ react w node_modules
✓ tailwindcss w node_modules
```

Aby sprawdzić:
```bash
npm list electron react tailwindcss
```

## 🎓 Następne kroki

Po pomyślnej instalacji:

1. Przeczytaj [README.md](README.md) by dowiedzieć się o funkcjach
2. Sprawdź [src/](src/) folder aby zrozumieć strukturę kodu
3. Zapoznaj się z [tailwind.config.js](tailwind.config.js) aby zmodyfikować style

Powodzenia! 🚀
