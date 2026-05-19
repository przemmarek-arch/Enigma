# Dziennik prac

Miejsce do zapisywania postępu, decyzji i kolejnych kroków w projekcie Enigma.

## Aktualny status

- Data: 2026-05-19
- Co zostało zrobione:
  - Rozpoczęto przebudowę UI aplikacji w kierunku bardziej profesjonalnego, spokojnego i nowoczesnego interfejsu.
  - Zmieniono główny layout w `src/App.js` na boczną nawigację i obszar roboczy.
  - Odświeżono `Header`, `FileUpload`, `PasswordInput`, sekcje szyfrowania/odszyfrowania oraz widoki PDF.
  - Ograniczono gradienty, emoji i wizualny hałas na rzecz neutralnej typografii, jasnych paneli, segmentów i czytelnych stanów.
  - Zweryfikowano redesign poleceniem `npm run build`; kompilacja przechodzi poprawnie.
  - Sprawdzono główne widoki w przeglądarce na desktopie i mobile.
  - Ujednolicono promienie narożników paneli i zabezpieczono krótkie etykiety przed łamaniem tekstu.
  - Dodano lokalny panel rejestracji/logowania oraz historię operacji per użytkownik.
- Co jest w toku:
  - Dalsza decyzja, czy konta mają pozostać lokalne, czy przejść na backend z synchronizacją między urządzeniami.
- Blokery:
  - Brak aktywnych blokerów po stronie kompilacji UI.

## Następne kroki

- Uruchomić `npm run electron-dev` i sprawdzić przepływy w środowisku Electron.
- Zweryfikować szyfrowanie i odszyfrowanie przykładowego pliku `.enigma`.
- Zweryfikować dodawanie, usuwanie i zmianę hasła PDF na przykładowym dokumencie.
- Jeżeli historia ma działać między urządzeniami, podłączyć backend uwierzytelniania i bazę danych.

## Decyzje techniczne

- Redesign dotyczy wyłącznie warstwy UI; logika szyfrowania, odszyfrowania i PDF pozostaje bez zmian.
- Kierunek wizualny: produktowy interfejs desktopowy, neutralna paleta, mocne focus states i mniej dekoracyjnych gradientów.

## Historia wpisów

### 2026-05-17

- Utworzono dziennik prac dla projektu.
- Rozpoczęto redesign aplikacji. Zmieniono główny layout, nagłówek, upload plików, pola haseł oraz sekcje plików i PDF. Build wymaga dokończenia później, ponieważ proces został przerwany.

### 2026-05-19

- Dokończono weryfikację redesignu: `npm run build` przechodzi poprawnie.
- Sprawdzono widoki Szyfruj, Odszyfruj i PDF w przeglądarce.
- Poprawiono responsywność etykiet i ujednolicono promienie narożników w UI.
- Dodano lokalne konta użytkowników, logowanie, wylogowanie i widok historii dokumentów.
- Historia zapisuje metadane udanych operacji bez haseł i bez zawartości plików.
