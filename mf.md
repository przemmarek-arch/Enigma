# Enigma - komendy do zapamiętania

Ten plik jest ściągą z najczęściej używanych komend w projekcie Enigma.
Komendy uruchamiaj w PowerShellu w katalogu projektu:

cd C:\Users\DELL\Desktop\Enigma


## Instalacja zależności

Instaluje paczki z package-lock.json:

npm install


## Uruchamianie aplikacji

Uruchamia aplikację React w przeglądarce:

npm start

Uruchamia React i Electron razem:

npm run electron-dev

Uruchamia samo Electron:

npm run electron


## Budowanie aplikacji

Buduje wersję produkcyjną React do folderu build:

npm run build

Buduje React i pakuje aplikację Electron:

npm run electron-build

Buduje instalator Windows NSIS bez publikowania:

npm run package-win


## Testy

Uruchamia testy Create React App:

npm test


## Przydatne komendy PowerShell

Pokazuje pliki w aktualnym folderze:

Get-ChildItem

Pokazuje pliki razem z ukrytymi:

Get-ChildItem -Force

Pokazuje aktualną ścieżkę:

Get-Location

Czyści terminal:

Clear-Host

Wyświetla zawartość pliku:

Get-Content README.md

Wyszukuje tekst w plikach, np. "password":

rg "password"

Wyszukuje pliki po nazwie, np. komponent PasswordInput:

rg --files | rg "PasswordInput"


## Git

Pokazuje, co zostało zmienione:

git status

Pokazuje różnice w plikach:

git diff

Dodaje konkretny plik do commita:

git add src/App.js

Dodaje wszystkie zmiany do commita:

git add .

Tworzy commit z krótkim opisem:

git commit -m "Fix decrypt error handling"

Pokazuje historię commitów:

git log --oneline


## Gdy coś nie działa

Sprawdź, czy jesteś w dobrym folderze:

Get-Location

Sprawdź, czy zależności są zainstalowane:

Test-Path node_modules

Sprawdź błędy budowania:

npm run build

Sprawdź instrukcje projektu:

Get-Content README.md
Get-Content DEVELOPMENT.md
Get-Content TROUBLESHOOTING.md


## VS Code - kolory i literki Git w Explorerze

To jest wbudowana funkcja VS Code, nie GitLens. Dzięki temu w panelu Explorer widać np.:

- M - plik zmodyfikowany
- U - plik nowy / untracked
- A - plik dodany do Git
- kolory plików zależnie od stanu Git

W tym repo dodałem ustawienia do pliku:

.vscode/settings.json

Najważniejsze ustawienia:

```json
{
  "git.path": "C:\\Program Files\\Git\\cmd\\git.exe",
  "git.enabled": true,
  "git.decorations.enabled": true,
  "explorer.decorations.badges": true,
  "explorer.decorations.colors": true,
  "scm.diffDecorations": "all",
  "gitlens.views.fileHistory.enabled": true
}
```

Po zmianie ustawień zrób reload VS Code:

Ctrl+Shift+P
Developer: Reload Window


## Gdy kolega dalej nie widzi zmian Git w Explorerze

Sprawdź, czy VS Code widzi Git:

Ctrl+Shift+P
Git: Show Git Output

Jeśli jest błąd typu "git not found", trzeba zainstalować Git albo dodać go do PATH.

W tym repo VS Code ma ustawioną ręczną ścieżkę do Git:

```json
"git.path": "C:\\Program Files\\Git\\cmd\\git.exe"
```

Jeśli u kolegi Git jest w innym miejscu, znajdź plik `git.exe` i podmień tę ścieżkę w:

.vscode/settings.json

Sprawdź, czy wbudowane rozszerzenia Git są włączone:

Ctrl+Shift+X
@builtin git

Włącz:

- Git
- Git Base

Sprawdź, czy otwarty folder jest repozytorium Git:

Get-ChildItem -Force

W folderze projektu powinien być widoczny folder:

.git

Jeśli folder `.git` nie istnieje, VS Code nie ma skąd brać statusów plików.

Sprawdź, czy Git działa w terminalu:

git --version

Jeśli ta komenda nie działa, VS Code też zwykle nie pokaże dekoracji Git poprawnie.
