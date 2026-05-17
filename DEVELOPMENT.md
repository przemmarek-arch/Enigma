# DEVELOPMENT.md - Przewodnik dla deweloperów

## 🏗️ Architektura projektu

### Frontend (React)

```
src/
├── App.js                 # Główny komponent z routingiem
├── components/
│   ├── Header.js          # Nagłówek aplikacji
│   ├── EncryptSection.js  # Sekcja szyfrowania
│   ├── DecryptSection.js  # Sekcja odszyfrowania
│   ├── FileUpload.js      # Komponent drag & drop
│   └── PasswordInput.js    # Input hasła z siłą
└── index.css              # Globalne style
```

### Desktop (Electron)

```
public/
├── electron.js            # Main process (logika desktopowa)
├── preload.js             # IPC bridge (bezpieczeństwo)
└── index.html             # HTML template
```

## 🔐 Szyfrowanie

### Algorytm

1. **Derivacja klucza**: PBKDF2-SHA256 (100,000 iteracji)
2. **Szyfrowanie**: AES-256-CBC
3. **Random values**: 
   - Salt: 32 bajty
   - IV: 16 bajtów

### Struktura zaszyfrowanego pliku

```
[Salt (32 bytes)] + [IV (16 bytes)] + [Encrypted Data]
```

### Web Crypto API

Szyfrowanie jest wykonywane za pomocą natywnego Web Crypto API przeglądarki:

```javascript
// Derywacja klucza
crypto.subtle.deriveBits()

// Szyfrowanie
crypto.subtle.encrypt({ name: 'AES-CBC', iv })

// Odszyfrowanie  
crypto.subtle.decrypt({ name: 'AES-CBC', iv })
```

## 🎨 Tailwind CSS

### Kolory

- **Primary**: Purple (Szyfrowanie)
- **Secondary**: Blue/Cyan (Odszyfrowanie)
- **Background**: Dark gradient (slate-900 → purple-900)

### Breakpoints

Używamy domyślnych breakpoints Tailwind:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## 🔄 IPC Komunikacja

### Main Process (electron.js)

- `encrypt-file`: Szyfrowanie pliku
- `decrypt-file`: Odszyfrowanie pliku
- `select-file`: Dialog wyboru pliku
- `save-file`: Dialog zapisu pliku

### Preload (preload.js)

Bezpiecznie eksponuje API do rendererze:

```javascript
window.electronAPI.encryptFile(filePath, password)
window.electronAPI.decryptFile(encryptedData, password)
```

## 📝 Zasady kodowania

### Komponenty React

- Komponenty są funkcyjne (hooks)
- Stan zarządzany za pomocą `useState`
- Konwencja nazewnictwa: PascalCase
- Jeden komponent = jeden plik

### Stylowanie

- Używamy Tailwind CSS (nie CSS modules)
- Tachyons-inspired naming
- Gradients dla nowoczesnego wyglądu
- Mobile-first approach

### Bezpieczeństwo

- IPC z contextIsolation enabled
- Preload script dla bezpieczeństwa
- Nie używamy eval() lub innerHTML
- Hasła nigdy nie są wysyłane do main process

## 🚀 Build Process

### Development
```bash
npm run electron-dev  # React dev server + Electron
```

### Production
```bash
npm run build         # Build React app
npm run electron      # Run built Electron
```

### Packaging
```bash
npm run electron-build  # Build installer dla Windows
```

## 🐛 Debugowanie

### React DevTools

Dostępne w `npm run electron-dev`:
- React Developer Tools w DevTools
- Redux DevTools (jeśli zainstalowany)

### Electron DevTools

Automatycznie otwiera się w dev mode. Możesz wyłączyć w `public/electron.js`:

```javascript
// Usunąć lub zakomentować:
if (isDev) {
  mainWindow.webContents.openDevTools();
}
```

### Logging

```javascript
// React
console.log('debug msg')

// Electron main process
console.log('main process msg')

// Zie output w console
```

## 📚 Przydatne zasoby

- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

## 🔧 Modyfikacje

### Dodanie nowego formatu pliku

1. Edytuj `FileUpload.js` - dodaj extension do `accept`
2. Edytuj `README.md` - dodaj do supported formats
3. Test szyfrowania/odszyfrowania

### Zmiana szyfru

1. Edytuj algorytm w `EncryptSection.js` i `DecryptSection.js`
2. Zmień PBKDF2 iterations dla mocniejszego zabezpieczenia
3. Update `DEVELOPMENT.md` z nowymi parametrami

### Personalizacja kolorów

Edytuj `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#7c3aed',  // Purple
      secondary: '#0ea5e9' // Cyan
    }
  }
}
```

## 📦 Dependencies

- **react** (18.2.0) - UI framework
- **tailwindcss** (3.3.0) - Styling
- **electron** (27.0.0) - Desktop app
- **crypto-js** - Legacy (nie używane, ale może być przydatne)

## ⚠️ Ważne notatki

1. **Web Crypto API** - nie obsługuje starszych przeglądarek
2. **PBKDF2** - użycie 100,000 iteracji może być wolne na słabszych urządzeniach
3. **AES-256-CBC** - zawsze użyj nowego IV dla każdego szyfrowania
4. **File size limit** - WebCrypto może obsługiwać duże pliki, ale pamięć jest ograniczona

## 🤝 Contributing

Aby dodać nową funkcję:

1. Utwórz nowy branch: `git checkout -b feature/name`
2. Implementuj zmiany
3. Test aplikacji: `npm run electron-dev`
4. Commit: `git commit -m "Add feature"`
5. Push i utwórz Pull Request

Powodzenia! 🎉
