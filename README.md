# Enigma

```text
███████╗███╗   ██╗██╗ ██████╗ ███╗   ███╗ █████╗
██╔════╝████╗  ██║██║██╔════╝ ████╗ ████║██╔══██╗
█████╗  ██╔██╗ ██║██║██║  ███╗██╔████╔██║███████║
██╔══╝  ██║╚██╗██║██║██║   ██║██║╚██╔╝██║██╔══██║
███████╗██║ ╚████║██║╚██████╔╝██║ ╚═╝ ██║██║  ██║
╚══════╝╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝

        Lokalny sejf na pliki i hasła PDF
```

Enigma to desktopowa aplikacja do lokalnego szyfrowania plików oraz zarządzania hasłami dokumentów PDF. Projekt jest zbudowany w React 18, Tailwind CSS i Electron, dzięki czemu działa jako aplikacja okienkowa, a główny przepływ pracy pozostaje skupiony na plikach zapisanych na komputerze użytkownika.

```text
+------------------+      +-------------------+      +------------------+
|  Plik lokalny    | ---> |  Hasło użytkownika | ---> |  Plik .enigma    |
+------------------+      +-------------------+      +------------------+
        |                         |                           |
        |                         v                           |
        |              PBKDF2 + AES-256-CBC                   |
        +-----------------------------------------------------+
```

Projekt udostępnia dwa główne obszary:

- szyfrowanie i odszyfrowywanie zwykłych plików przy użyciu kluczy AES-256-CBC wyprowadzanych z hasła,
- narzędzia PDF do dodawania, usuwania i zmiany haseł dokumentów.

## Funkcje

```text
┌─────────────────────────────┐
│ SZYFROWANIE                 │
├─────────────────────────────┤
│ .enigma                     │
│ drag and drop               │
│ potwierdzanie hasła         │
│ ocena siły hasła            │
└─────────────────────────────┘

┌─────────────────────────────┐
│ PDF                         │
├─────────────────────────────┤
│ dodaj hasło                 │
│ usuń hasło                  │
│ zmień hasło                 │
│ zapisz zaszyfrowany wynik   │
└─────────────────────────────┘
```

- Szyfrowanie plików lokalnych do kontenerów `.enigma`.
- Odszyfrowywanie plików `.enigma` do ich oryginalnych nazw.
- Wybór pliku przez kliknięcie albo przeciągnięcie do aplikacji.
- Potwierdzanie hasła i podstawowa informacja o sile hasła.
- Operacje na hasłach PDF:
  - dodanie hasła do dokumentu PDF,
  - usunięcie hasła z chronionego dokumentu PDF,
  - zmiana istniejącego hasła PDF,
  - zapis nowego, zaszyfrowanego pliku PDF.
- Pakowanie aplikacji desktopowej dla Windows.
- Rejestracja i logowanie użytkowników.
- Historia operacji szyfrowania zapisywana per użytkownik.
- Opcjonalny backend Supabase dla synchronizacji kont i historii między urządzeniami.

## Technologie

| Warstwa | Technologia |
| --- | --- |
| Interfejs | React 18 |
| Aplikacja desktopowa | Electron 27 |
| Style | Tailwind CSS |
| Kryptografia w rendererze | Web Crypto API |
| Pomocnicza kryptografia IPC | Node.js Crypto API |
| Obsługa PDF | `pdf-lib` |
| Backend webowy | Supabase |
| Narzędzia build | Create React App |
| Pakowanie | Electron Builder |

## Wymagania

- Node.js 14 lub nowszy.
- npm.
- Windows, macOS albo Linux do pracy deweloperskiej.

Pakowanie dla Windows jest skonfigurowane w Electron Builder z targetami NSIS oraz portable.

## Szybki Start

```text
┌──────────────┐
│ npm install  │  instalacja zależności
└──────┬───────┘
       v
┌──────────────┐
│ npm start    │  uruchomienie Reacta w przeglądarce
└──────┬───────┘
       v
┌──────────────────────┐
│ npm run electron-dev │  pełna aplikacja Electron
└──────────────────────┘
```

Zainstaluj zależności:

```bash
npm install
```

Uruchom serwer deweloperski React w przeglądarce:

```bash
npm start
```

Uruchom pełną aplikację Electron w trybie deweloperskim:

```bash
npm run electron-dev
```

Utwórz produkcyjny build React:

```bash
npm run build
```

Zbuduj aplikację Electron:

```bash
npm run electron-build
```

Zbuduj instalator Windows bez publikowania:

```bash
npm run package-win
```

## Dostępne Skrypty

| Komenda | Opis |
| --- | --- |
| `npm start` | Uruchamia serwer deweloperski Create React App. |
| `npm run electron-dev` | Uruchamia Reacta i startuje Electron po wykryciu `localhost:3000`. |
| `npm run build` | Buduje produkcyjny pakiet React do katalogu `build/`. |
| `npm run deploy:web` | Buduje wersję webową i publikuje katalog `build/` na gałąź `gh-pages`. |
| `npm run electron` | Uruchamia Electron z aktualnie skonfigurowanym wejściem aplikacji. |
| `npm run electron-build` | Buduje Reacta i pakuje aplikację Electron. |
| `npm run package-win` | Tworzy instalator Windows NSIS bez publikowania. |
| `npm test` | Uruchamia test runner Create React App. |

## Użycie

### Szyfrowanie Plików

1. Otwórz kartę **Szyfruj**.
2. Wybierz plik albo przeciągnij go w obszar przesyłania.
3. Wpisz i potwierdź hasło.
4. Kliknij **Szyfruj plik**.
5. Zaszyfrowany plik zostanie pobrany z rozszerzeniem `.enigma`.

Zaszyfrowany wynik przechowuje sól, IV i szyfrogram w jednym pliku binarnym:

```text
[32 bajty soli][16 bajtów IV][zaszyfrowana zawartość]
```

### Odszyfrowywanie Plików

1. Otwórz kartę **Odszyfruj**.
2. Wybierz plik `.enigma`.
3. Wpisz hasło użyte podczas szyfrowania.
4. Kliknij **Odszyfruj plik**.
5. Odszyfrowany plik zostanie pobrany pod oryginalną nazwą.

### Narzędzia PDF

Otwórz kartę **PDF**, aby pracować z hasłami dokumentów. Narzędzia PDF pozwalają dodać nowe hasło, usunąć istniejące hasło oraz zmienić hasło w chronionym dokumencie.

```text
PDF bez hasła  ── dodaj hasło ──>  PDF chroniony
PDF chroniony  ── usuń hasło  ──>  PDF bez hasła
PDF chroniony  ── zmień hasło ──>  PDF z nowym hasłem
```

### Konta i Historia

Aplikacja ma panel rejestracji/logowania oraz zakładkę **Historia**. Historia zapisuje wyłącznie metadane udanych operacji: typ akcji, nazwę pliku, nazwę wyniku, rozmiar, typ MIME i datę. Hasła oraz zawartość dokumentów nie są zapisywane.

Bez konfiguracji backendu dane kont i historii pozostają lokalnie w przeglądarce. Aby włączyć synchronizację między urządzeniami, skonfiguruj Supabase:

1. Utwórz projekt Supabase.
2. W panelu SQL uruchom skrypt `supabase/schema.sql`.
3. Skopiuj `.env.example` do `.env`.
4. Ustaw `REACT_APP_SUPABASE_URL` i `REACT_APP_SUPABASE_ANON_KEY`.
5. Uruchom `npm run build` albo `npm run deploy:web`.

Dla wdrożenia GitHub Pages ustaw te same wartości jako GitHub Secrets:

```bash
gh secret set REACT_APP_SUPABASE_URL
gh secret set REACT_APP_SUPABASE_ANON_KEY
```

Po ustawieniu secretów uruchom workflow **Deploy web app** albo wypchnij commit na `main`.

## Model Bezpieczeństwa

Ogólne szyfrowanie plików używa:

- PBKDF2 z SHA-256,
- 100 000 iteracji wyprowadzania klucza,
- losowej 32-bajtowej soli dla każdego pliku,
- losowego 16-bajtowego IV dla każdego pliku,
- szyfrowania AES-256-CBC.

Hasła, klucze pochodne, sole, IV oraz odszyfrowana zawartość plików nie powinny być logowane ani zapisywane poza zamierzonym wynikiem działania aplikacji. Enigma generuje zaszyfrowane pliki lokalnie i nie wymaga kont użytkowników ani usług zewnętrznych.

Uwaga implementacyjna: AES-CBC zapewnia szyfrowanie, ale nie daje wbudowanego uwierzytelnienia danych. Dla mocniejszego wykrywania modyfikacji przyszła wersja powinna używać szyfrowania uwierzytelnionego, na przykład AES-GCM, albo dodać HMAC dla zaszyfrowanej zawartości.

## Struktura Projektu

```text
Enigma/
├── public/
│   ├── electron.js          # główny proces Electron
│   ├── preload.js           # bezpieczny most IPC
│   └── index.html           # szablon HTML
├── src/
│   ├── components/
│   │   ├── DecryptSection.js
│   │   ├── EncryptSection.js
│   │   ├── FileUpload.js
│   │   ├── Header.js
│   │   ├── PasswordInput.js
│   │   ├── PDFDecryptSection.js
│   │   ├── PDFEncryptSection.js
│   │   ├── PDFPasswordManager.js
│   │   └── PDFSection.js
│   ├── utils/
│   │   └── pdfUtils.js      # pomocnicze funkcje PDF
│   ├── App.js               # główna aplikacja React
│   ├── index.js             # punkt wejścia React
│   └── index.css            # style Tailwind
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

Katalogi generowane, takie jak `build/`, `dist/` i `node_modules/`, nie powinny być edytowane ręcznie.

## Notatki Deweloperskie

- Komponenty React powinny być funkcyjne i oparte na hookach.
- Jeden plik powinien zawierać jeden główny komponent.
- Preferuj klasy narzędziowe Tailwind zamiast nowych globalnych stylów CSS.
- Zachowuj ustawienia bezpieczeństwa Electron: `nodeIntegration: false`, `contextIsolation: true` i dostęp renderera przez `preload.js`.
- Nie używaj `eval`, niebezpiecznego `innerHTML` ani logowania haseł i kluczy.
- Przy zmianach w szyfrowaniu, PDF albo IPC dodawaj skupione testy blisko kodu, który obejmują.

## Testowanie

Uruchom testy:

```bash
npm test
```

Dla zmian dotyczących szyfrowania, odszyfrowywania, PDF albo Electron IPC sprawdź też ręcznie przepływ w aplikacji:

```bash
npm run electron-dev
```

Zalecane sprawdzenia ręczne:

- zaszyfruj i odszyfruj przykładowy plik,
- spróbuj odszyfrować plik błędnym hasłem,
- dodaj hasło do PDF,
- usuń hasło z chronionego PDF,
- zmień hasło PDF i otwórz wygenerowany plik.

## Pakowanie

Konfiguracja Electron Builder w `package.json` definiuje:

- identyfikator aplikacji: `com.enigma.encryptor`,
- nazwę produktu: `Enigma`,
- targety Windows: instalator NSIS i wersja portable.

Artefakty builda są generowane w katalogu `dist/`.

## Licencja

Projekt jest udostępniany na licencji MIT. Szczegóły znajdują się w pliku [LICENSE](LICENSE).
