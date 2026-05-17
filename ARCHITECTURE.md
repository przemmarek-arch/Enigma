# ARCHITECTURE.md - Dokumentacja architektury

## 🏛️ Ogólny przegląd

Enigma to aplikacja desktopowa zbudowana na:
- **Frontend**: React 18 + Tailwind CSS
- **Desktop Runtime**: Electron 27
- **Encryption**: Web Crypto API (AES-256-CBC)
- **Build**: Create React App + Electron Builder

## 📊 Diagram przepływu

```
┌─────────────────────────────────────────────────────────┐
│                      Użytkownik                         │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────────┐
         │     React UI (Renderer Process)   │
         │  - EncryptSection                 │
         │  - DecryptSection                 │
         │  - FileUpload (Drag & Drop)       │
         │  - PasswordInput                  │
         └────────────┬────────────────────┘
                      │
                      │ IPC (Inter-Process Communication)
                      │
         ┌────────────▼────────────────────┐
         │   Preload Bridge (Security)     │
         │  - contextIsolation: true       │
         │  - nodeIntegration: false       │
         └────────────┬────────────────────┘
                      │
         ┌────────────▼────────────────────────────┐
         │   Main Process (Electron)               │
         │  - Window Management                    │
         │  - IPC Handlers                         │
         │  - File Dialog APIs                     │
         │  - Encryption Logic (Node.js crypto)    │
         └────────────┬─────────────────────────────┘
                      │
                      ▼
         ┌─────────────────────────────┐
         │   Filesystem / Download     │
         │  - Read/Write Files         │
         │  - Save Encrypted Files     │
         └─────────────────────────────┘
```

## 🔐 Proces szyfrowania

```
1. Wybierz plik (FileUpload component)
   │
2. Wpisz hasło (PasswordInput component)
   │
3. Kliknij "Szyfruj"
   │
4. EncryptSection.js:
   - Odczytaj zawartość pliku (File API)
   - Wygeneruj salt (32 bytes)
   - Wygeneruj IV (16 bytes)
   │
5. Web Crypto API:
   - Derywuj klucz z hasła (PBKDF2-SHA256, 100k iteracji)
   - Szyfruj dane (AES-256-CBC)
   │
6. Utwórz plik:
   - Combine: salt + IV + encrypted_data
   - Utwórz Blob
   │
7. Pobierz:
   - Utwórz URL obiektu
   - Trigger download
   - Usuń URL z pamięci
```

## 🔓 Proces odszyfrowania

```
1. Wybierz plik .enigma
   │
2. Wpisz hasło
   │
3. Kliknij "Odszyfruj"
   │
4. DecryptSection.js:
   - Odczytaj zawartość pliku
   - Wyodrębnij salt (pierwsze 32 bajty)
   - Wyodrębnij IV (następne 16 bajtów)
   - Wyodrębnij encrypted_data (reszta)
   │
5. Web Crypto API:
   - Derywuj klucz (musi być identyczny jak przy szyfrowaniu!)
   - Odszyfruj dane (AES-256-CBC)
   │
6. Utwórz plik:
   - Utwórz Blob z odszyfrowanymi danymi
   │
7. Pobierz:
   - Przywróć oryginalną nazwę pliku
   - Trigger download
```

## 📁 Struktury plików

### Plik zaszyfrowany (.enigma)

```
Offset | Size (bytes) | Content
-------|--------------|------------------
0      | 32          | Salt (PBKDF2)
32     | 16          | IV (AES-256-CBC)
48     | N           | Szyfrowane dane
```

### Package.json struktura

```json
{
  "name": "enigma-encryptor",
  "main": "public/electron.js",        // Entry point dla Electron
  "homepage": "./",                     // Public URL dla React
  "build": { ... },                     // Electron Builder config
  "scripts": {
    "electron-dev": "...",              // Dev mode
    "electron-build": "..."             // Build instalatora
  }
}
```

## 🔄 Component Lifecycle

### EncryptSection

```
Mount
  ↓
[File Upload] → [Password Input] → [Encrypt Button]
  ↓                                    ↓
setFile() ──────────────────────────→ handleEncrypt()
  ↓                                    ↓
[State Update] ────────────────────→ [Web Crypto]
  ↓                                    ↓
[Render] ───────────────────────────→ Download
```

## 🛡️ Bezpieczeństwo

### IPC Isolation

```
┌─────────────────────────────────────────────────────┐
│         Renderer Process (React App)                │
│  - Brak dostępu do fs module                       │
│  - Brak dostępu do Node.js APIs                    │
│  - contextIsolation: true                          │
└─────────────────┬───────────────────────────────────┘
                  │ Preload script (sand-boxed)
                  │ contextBridge.exposeInMainWorld()
┌─────────────────▼───────────────────────────────────┐
│         Main Process (Electron)                     │
│  - Pełny dostęp do Node.js                        │
│  - Pełny dostęp do OS APIs                        │
│  - Kontroluje IPC messages                        │
└─────────────────────────────────────────────────────┘
```

### Encryption Standards

- **Key Derivation**: PBKDF2-SHA256 (100,000 iterations)
- **Cipher**: AES-256-CBC (256-bit key)
- **IV**: Losowy dla każdego szyfrowania
- **Salt**: Losowy dla każdego szyfrowania
- **Authentication**: Kontrola hasła podczas odszyfrowania

## 🎨 UI/UX Flow

```
[App.js]
  ├── <Header />                (Tytuł + info)
  ├── [Tab Navigation]          (Szyfruj/Odszyfruj)
  └── [Active Tab Content]
      ├── EncryptSection
      │   ├── <FileUpload />
      │   ├── <PasswordInput />
      │   └── [Button: Szyfruj]
      │
      └── DecryptSection
          ├── <FileUpload />
          ├── <PasswordInput />
          └── [Button: Odszyfruj]
```

## ⚙️ Configuration

### Tailwind Configuration

```javascript
// tailwind.config.js
- Content: src/** i public/index.html
- Theme: Customized slate colors + gradients
- Plugins: autoprefixer, postcss
```

### Electron Configuration

```javascript
// public/electron.js
- Node Integration: disabled
- Context Isolation: enabled
- Preload: enabled
- Window size: 1200x800
- Icons: placeholder (do customize)
```

## 🚀 Build Pipeline

```
npm run electron-dev
  ├─ npm start (React dev server :3000)
  └─ wait-on http://localhost:3000
     └─ electron . (Electron app loads from React)

npm run build
  ├─ react-scripts build (creates /build)
  └─ webpack minification

npm run electron-build
  ├─ npm run build
  ├─ electron-builder
  └─ creates /dist/ with installers
```

## 📈 Performance Considerations

### Large Files

- Web Crypto API stream-friendly
- Pamięć: Pełny plik musi być załadowany w RAM
- Rekomendacja: < 500MB dla płynnego działania

### Key Derivation

- PBKDF2 100k iteracji = ~100-200ms na nowoczesnym CPU
- Może być wolna na słabszych maszynach
- Można zmienić liczbę iteracji w kodzie

### UI Responsiveness

- Szyfrowanie/odszyfrowanie uruchamiane na głównym wątku
- Dla dużych plików rozważ Web Workers (future improvement)

## 🔄 Version & Dependencies

- Node.js: 14.0+
- React: 18.2.0
- Electron: 27.0.0
- Tailwind: 3.3.0
- Build: Create React App 5.0.1

## 📝 Future Improvements

1. **Web Workers**: Offload crypto operations
2. **Drag & drop**: Multiple file support
3. **GPU Acceleration**: Use WebGPU for faster encryption
4. **Progressive Web App**: Browser version
5. **Cloud Integration**: Save to cloud storage
6. **File preview**: Show file content before encryption
7. **Batch operations**: Encrypt multiple files
8. **Password strength meter**: More detailed analysis
9. **Two-factor encryption**: Multiple password layers
10. **File compression**: Reduce file size before encryption

Powodzenia w developowaniu! 🎉
