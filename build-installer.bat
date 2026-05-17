@echo off
cd /d "%~dp0"
echo Budowanie instalatora Enigma...
call "C:\Program Files\nodejs\npm.cmd" run package-win
if errorlevel 1 (
  echo.
  echo Błąd: budowanie instalatora nie powiodło się.
  echo Spróbuj uruchomić ten plik jako Administrator.
  pause
  exit /b 1
)
echo.
echo Budowanie zakończone pomyślnie.
echo Sprawdź katalog dist\ oraz dist\win-unpacked\Enigma.exe
pause
