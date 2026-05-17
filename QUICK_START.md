# 🚀 QUICK START - Szybki start Enigma

## 30 sekund do uruchomienia

### 1️⃣ Zainstaluj Node.js (jeśli go nie masz)

**Windows:**
- Pobierz z https://nodejs.org/ (Click LTS button)
- Uruchom instalator
- Kliknij Next → Finish

**macOS:**
```bash
brew install node
```

**Linux:**
```bash
sudo apt install nodejs npm
```

### 2️⃣ Zainstaluj projekt

```bash
cd Enigma
npm install
```

To potrwa 2-3 minuty...

### 3️⃣ Uruchom aplikację

**Windows PowerShell:**

```powershell
Set-Location 'c:\Users\DELL\Desktop\Enigma'
& 'C:\Program Files\nodejs\npm.cmd' run electron-dev
```

**Inny terminal / CMD:**

```bash
cd Enigma
npm run electron-dev
```

**GOTOWE!** 🎉 Enigma powinna się otworzyć!

## 📝 Używanie aplikacji

### Szyfrowanie pliku

1. **Tab "Szyfruj"** (już zaznaczony)
2. **Drag & Drop** - Przeciągnij plik lub kliknij
3. **Wpisz hasło** - Min. 6 znaków
4. **Potwierdź hasło**
5. **Kliknij "Szyfruj plik"**
6. ✅ Plik `nazwa.enigma` pobierze się automatycznie

### Odszyfrowanie pliku

1. **Tab "Odszyfruj"**
2. **Drag & Drop** - Przeciągnij plik `.enigma`
3. **Wpisz hasło** - To samo, które użyłeś do szyfrowania
4. **Kliknij "Odszyfruj plik"**
5. ✅ Oryginalny plik pobierze się automatycznie

## 🛠️ Dostępne komendy

```bash
npm run electron-dev      # Uruchom w trybie dev (z DevTools)
npm run build             # Zbuild React aplikacji
npm run electron          # Uruchom gotową aplikację
npm run electron-build    # Utwórz instalator (.exe dla Windows)
npm run package-win       # Utwórz instalator Windows NSIS (.exe) (może wymagać uruchomienia jako Administrator)
```

## ⚠️ Problemy?

### "Command not found: npm"

- Node.js nie jest zainstalowany
- Zainstaluj z https://nodejs.org/
- Uruchom nowy terminal

### "Port 3000 is already in use"

```bash
# Zabij proces na porcie 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID] /F

# macOS/Linux:
lsof -i :3000
kill -9 [PID]
```

### Aplikacja się nie uruchamia

```bash
# Wyczyść cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Spróbuj ponownie
npm run electron-dev
```

> Jeśli używasz PowerShell i widzisz błąd z `npm.ps1`, zamiast `npm` użyj:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run electron-dev
```

## 📚 Dalsze kroki

- Przeczytaj [README.md](README.md) - Pełna dokumentacja
- Sprawdź [ARCHITECTURE.md](ARCHITECTURE.md) - Jak to działa
- Modyfikuj [src/components](src/components) - Dodaj nowe funkcje

## 🎓 Naucz się

Kiedy aplikacja jest uruchomiona (`npm run electron-dev`):

1. **F12** - Otwórz DevTools (React + Chrome)
2. **Konsola** - Debuguj JavaScript
3. **Sources** - Czytaj/edytuj kod na żywo
4. **Network** - Obserwuj IPC messages

## 💡 Tips

- Hasło musi być **min. 6 znaków**
- Obsługiwane formaty: **PDF, DOC, JPG, PNG, ENIGMA**
- Każde szyfrowanie używa **nowego losowego salt i IV**
- Hasła **nigdy nie są przechowywane** - muszą być pamiętane

## 🔐 Bezpieczeństwo

- ✅ AES-256 szyfrowanie (militarne standardy)
- ✅ PBKDF2-SHA256 (100,000 iteracji)
- ✅ Wszystkie operacje na Twoim komputerze
- ✅ Bez wysyłania plików na serwery

## 🚀 Gotowy?

```bash
npm run electron-dev
```

Powodzenia! 🎉

---

**Pytania?** - Sprawdź README.md lub INSTALLATION.md
