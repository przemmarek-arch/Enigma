# 🐛 TROUBLESHOOTING - Rozwiązywanie problemów

## Problemy z instalacją

### ❌ "npm: command not found"

**Przyczyna:** Node.js nie jest zainstalowany

**Rozwiązanie:**
1. Pobierz Node.js z https://nodejs.org/
2. Zainstaluj (LTS version)
3. Restart terminal/PowerShell
4. Sprawdź: `node --version`

### ❌ "npm install" zawiesza się

**Przyczyna:** Problemy z npm cache lub zły internet

**Rozwiązanie:**
```bash
npm cache clean --force
npm install
```

**Alternatywnie** - użyj yarn:
```bash
npm install -g yarn
yarn install
```

### ❌ "Module not found" błędy

**Przyczyna:** Zależności nie są zainstalowane

**Rozwiązanie:**
```bash
# Usuń node_modules i zainstaluj od nowa
rm -rf node_modules package-lock.json
npm install
```

### ❌ "electron not found"

**Przyczyna:** Electron nie został zainstalowany

**Rozwiązanie:**
```bash
npm install electron --save-dev
```

---

## Problemy z uruchomieniem

### ❌ "Port 3000 is already in use"

**Przyczyna:** Inny proces używa port 3000

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

**macOS/Linux:**
```bash
lsof -i :3000
kill -9 [PID_NUMBER]
```

**Lub** - użyj innego portu:
```bash
PORT=3001 npm run electron-dev
```

### ❌ Aplikacja się nie uruchamia

**Przyczyna:** Zła konfiguracja

**Rozwiązanie:**
1. Sprawdź czy React dev server startuje: `npm start`
2. Sprawdź czy Electron startuje: `npm run electron`
3. Czytaj output w terminal

### ❌ "ENOENT: no such file or directory"

**Przyczyna:** Brak pliku `preload.js` lub `index.html`

**Rozwiązanie:**
```bash
# Sprawdź czy pliki istnieją
ls public/preload.js
ls public/index.html

# Jeśli nie, przywróć z repozytorium
```

### ❌ "Cannot find module 'react'"

**Przyczyna:** React nie jest zainstalowany w node_modules

**Rozwiązanie:**
```bash
npm install react react-dom
```

---

## Problemy z szyfrowaniem

### ❌ "Incorrect password or corrupted file"

**Przyczyna:** 
- Zła hasło
- Plik został uszkodzony
- Plik nie ma rozszerzenia `.enigma`

**Rozwiązanie:**
- Upewnij się że hasło jest poprawne
- Upewnij się że plik ma rozszerzenie `.enigma`
- Spróbuj ponownie zaszyfrować plik

### ❌ Proces szyfrowania trwa bardzo długo

**Przyczyna:** Duży plik > 500MB

**Rozwiązanie:**
- Poczekaj - szyfrowanie AES-256 jest bezpieczne ale wymaga czasu
- Dla dużych plików rozważ kompresję przed szyfrowaniem
- Lub rozważ używanie dysku twardego zamiast pendrive'u

### ❌ Brak dostępu do odszyfrowanego pliku

**Przyczyna:** Plik jest otwarty w innym programie

**Rozwiązanie:**
- Zamknij plik w innym programie
- Pobierz plik ponownie

---

## Problemy z UI/UX

### ❌ Interfejs wygląda dziwnie / Brak stylów

**Przyczyna:** Tailwind CSS nie jest załadowany

**Rozwiązanie:**
```bash
# Przebuilduj Tailwind CSS
npm run build
npm run electron
```

**Lub** w dev mode:
```bash
npm run electron-dev
```

### ❌ Drag & Drop nie działa

**Przyczyna:** Problem z przeglądarką/Electron

**Rozwiązanie:**
1. Spróbuj kliknąć i wybrać plik zamiast drag & drop
2. Zrestartuj aplikację

### ❌ Tekst jest za mały/duży

**Przyczyna:** Problem z DPI

**Rozwiązanie:**
- Edytuj [src/components/Header.js](src/components/Header.js)
- Zmień rozmiar fontów (text-xl → text-sm)

---

## Problemy z DevTools

### ❌ DevTools się nie otwierają

**Przyczyna:** Mogą być wyłączone

**Rozwiązanie:**
- Edytuj [public/electron.js](public/electron.js)
- Szukaj: `mainWindow.webContents.openDevTools()`
- Upewnij się że nie jest zakomentowane

### ❌ React DevTools nie widoczne

**Przyczyna:** Rozszerzenie nie jest zainstalowane

**Rozwiązanie:**
1. Zainstaluj React Developer Tools z Chrome Web Store
2. Zainstaluj Redux DevTools (opcjonalnie)
3. Reload aplikacji

---

## Problemy z buildingiem

### ❌ "npm run electron-build" zawiesza się

**Przyczyna:** Brak pliku `icon.png` lub inne problemy

**Rozwiązanie:**
```bash
# Sprawdź czy pliki istnieją
ls public/
ls build/

# Jeśli nie ma build/, zrób:
npm run build
```

### ❌ Instalator .exe się nie tworzy

**Przyczyna:** electron-builder nie jest zainstalowany

**Rozwiązanie:**
```bash
npm install electron-builder --save-dev
npm run electron-build
```

### ❌ Błędy przy budowaniu na macOS

**Przyczyna:** Konfiguracja dla Windows

**Rozwiązanie:**
- Edytuj [package.json](package.json)
- Zmień `"win": {...}` na `"mac": {...}`

---

## Problemy z plikami

### ❌ Nie mogę otworzyć zaakceptowanych formatów

**Przyczyna:** Format nie jest obsługiwany

**Rozwiązanie:**
- Obsługiwane: PDF, DOC, DOCX, JPG, PNG, ENIGMA
- Skonwertuj plik do jednego z obsługiwanych formatów

### ❌ Zaszyfrowany plik nie ma rozszerzenia .enigma

**Przyczyna:** Plik został pobrany bez rozszerzenia

**Rozwiązanie:**
1. Czytaj dialog pobierania uważnie
2. Ręcznie dodaj `.enigma` do nazwy pliku

### ❌ "File is too large"

**Przyczyna:** Plik > dostępna pamięć

**Rozwiązanie:**
- Kompresuj plik przed szyfrowaniem
- Lub rozważ split dużego pliku na części
- Lub użyj komputera z więcej RAM

---

## Ogólne poradniki

### Wyłącz DevTools dla produkcji

**Plik:** [public/electron.js](public/electron.js)

Zmień:
```javascript
if (isDev) {
  mainWindow.webContents.openDevTools();
}
```

Na:
```javascript
if (isDev && false) {  // false = wyłączone
  mainWindow.webContents.openDevTools();
}
```

### Zmień rozmiar okna

**Plik:** [public/electron.js](public/electron.js)

Zmień:
```javascript
mainWindow = new BrowserWindow({
  width: 1200,   // Zmień tu
  height: 800,   // I tu
  ...
})
```

### Zmień motyw kolorów

**Plik:** [tailwind.config.js](tailwind.config.js)

Zmień kolory w sekcji `theme.extend.colors`

### Dodaj nowy format pliku

**Plik:** [src/components/FileUpload.js](src/components/FileUpload.js)

Edytuj `accept`:
```javascript
accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.enigma,.zip"  // Dodaj .zip
```

---

## Nie znalazłeś rozwiązania?

1. Czytaj konsole błędów (F12 w aplikacji)
2. Sprawdź [ARCHITECTURE.md](ARCHITECTURE.md) aby zrozumieć architekturę
3. Sprawdź [DEVELOPMENT.md](DEVELOPMENT.md) dla szczegółów implementacji
4. Spróbuj `npm cache clean --force && npm install`

## 🆘 Ostateczne rozwiązanie

```bash
# Nuke everything and start fresh
rm -rf node_modules package-lock.json build dist
npm cache clean --force
npm install
npm run electron-dev
```

Powodzenia! 🚀
