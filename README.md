# Enigma - Zaawansowany Encryptor Plików

Nowoczesna aplikacja desktopowa do szyfrowania i odszyfrowania plików PDF, DOC i JPG za pomocą zaawansowanego szyfrowania AES-256.

## 🔐 Funkcjonalności

- **Szyfrowanie AES-256**: Militarne szyfrowanie symetryczne
- **Obsługa wielu formatów**: PDF, DOC, DOCX, JPG, PNG
- **Drag & Drop**: Wygodne przeciąganie plików
- **Nowoczesny interfejs**: Gradientowy, responsywny design
- **Siła hasła**: Wskaźnik jakości hasła w czasie rzeczywistym
- **Brak logowania**: Otwarta aplikacja bez rejestracji

## 📋 Wymagania

- Node.js (v14 lub wyżej)
- npm lub yarn
- Windows/MacOS/Linux

## 🚀 Instalacja

```bash
# Klonowanie lub rozpackowanie projektu
cd Enigma

# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run electron-dev

# Budowanie aplikacji
npm run electron-build
```

## 🛠️ Technologia

- **Frontend**: React 18 + Tailwind CSS
- **Desktop**: Electron
- **Szyfrowanie**: Web Crypto API (AES-256-CBC)
- **Budowanie**: React Scripts + Electron Builder

## 📝 Jak używać

### Szyfrowanie pliku
1. Kliknij na kartę "Szyfruj"
2. Przeciągnij plik lub kliknij aby wybrać
3. Wpisz hasło (min. 6 znaków)
4. Potwierdź hasło
5. Kliknij "Szyfruj plik"
6. Zaszyfrowany plik zostanie pobrany jako `nazwa.enigma`

### Odszyfrowanie pliku
1. Kliknij na kartę "Odszyfruj"
2. Wybierz plik `.enigma`
3. Wpisz hasło szyfrowania
4. Kliknij "Odszyfruj plik"
5. Odszyfrowany plik zostanie pobrany

## 🔒 Bezpieczeństwo

- AES-256-CBC szyfrowanie
- PBKDF2 z 100,000 iteracjami do derywacji klucza
- Losowy salt (32 bajty) i IV (16 bajtów) dla każdego pliku
- Brak przechowywania haseł

## 📦 Struktura projektu

```
Enigma/
├── public/
│   ├── electron.js          # Main process Electron
│   ├── preload.js           # IPC preload
│   └── index.html           # HTML template
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── EncryptSection.js
│   │   ├── DecryptSection.js
│   │   ├── FileUpload.js
│   │   └── PasswordInput.js
│   ├── App.js               # Główny komponent
│   ├── index.js             # React entry point
│   └── index.css            # Tailwind styles
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

## 🎨 Kolory i Design

- **Gradient**: Purple to Pink (szyfrowanie), Blue to Cyan (odszyfrowanie)
- **Tło**: Dark gradient (slate/purple)
- **Interfejs**: Nowoczesny, minimalistyczny z glassmorphism efektami

## 📄 Licencja

MIT

## 💬 Wsparcie

W razie pytań lub problemów, sprawdź dokumentację lub utwórz issue.
