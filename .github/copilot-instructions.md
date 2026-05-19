# Enigma Copilot Instructions

Projekt Enigma to nowoczesna aplikacja desktopowa do szyfrowania i odszyfrowania plików.

## Technologia

- **Frontend**: React 18 + Tailwind CSS
- **Desktop**: Electron 27
- **Encryption**: Web Crypto API (AES-256-CBC)
- **Build**: Create React App + Electron Builder

## Struktura projektu

```
Enigma/
├── public/               # Electron main process & HTML template
├── src/                  # React components & application logic
├── tailwind.config.js    # Tailwind CSS configuration
├── package.json          # Dependencies & scripts
└── INSTALLATION.md       # Setup instructions
```

## Instalacja zależności

```bash
npm install
```

## Uruchomienie

```bash
npm run electron-dev
```

## Build

```bash
npm run electron-build
```

## Ważne notatki

1. **Web Crypto API** - Wszystkie operacje szyfrowania są wykonywane po stronie klienta
2. **IPC Security** - Komunikacja między procesami jest bezpieczna (contextIsolation enabled)
3. **PBKDF2** - Używa 100,000 iteracji dla wyjątkowo mocnej derywacji klucza
4. **AES-256-CBC** - Standard szyfrowania militarnego

## Dla nowych developerów

- Przeczytaj [ARCHITECTURE.md](../ARCHITECTURE.md) aby zrozumieć strukturę
- Przeczytaj [DEVELOPMENT.md](../DEVELOPMENT.md) aby zapoznać się z kodowaniem
- Sprawdź [README.md](../README.md) dla funkcjonalności

## Zasady kodowania

- Komponenty React: Hooks + Functional components
- Stylowanie: Tailwind CSS (nie CSS modules)
- Bezpieczeństwo: Wszystkie operacje szyfrowania po stronie klienta
- Performance: Optymalizacja dla dużych plików

## Wsparcie

Jeśli masz pytania, sprawdź dokumentację w plikach `.md` w głównym folderze.
