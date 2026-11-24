@echo off
title HAKIKU - Buka Layar Penuh
REM Membuka HAKIKU (Canva) di browser dalam mode layar penuh (seperti menekan F11).
REM Mode ini tetap penuh walau pindah ke web tantangan lalu kembali ke Canva.
REM PENTING: tutup dulu semua jendela Chrome/Edge sebelum menjalankan file ini.
REM Untuk keluar dari layar penuh: tekan F11 (atau Alt+F4 untuk menutup).

set "URL=https://www.canva.com/design/DAHbv4LhBzI/C8xeXMSqxpSoeNVRyl8eNw/view"

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"
if exist "%CHROME%" (
  start "" "%CHROME%" --new-window --start-fullscreen "%URL%"
  exit /b
)

set "EDGE=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%EDGE%" set "EDGE=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if exist "%EDGE%" (
  start "" "%EDGE%" --new-window --start-fullscreen "%URL%"
  exit /b
)

echo Chrome atau Edge tidak ditemukan. Buka link Canva secara manual lalu tekan F11.
pause
