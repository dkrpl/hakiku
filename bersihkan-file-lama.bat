@echo off
REM ==========================================================
REM  HAKIKU - membersihkan file prototipe lama di folder ini.
REM  Folder .git, node_modules, "contoh hasil", dan file PRD TIDAK dihapus.
REM  Jalankan sekali dengan klik dua kali. Aman dijalankan ulang.
REM ==========================================================
cd /d "%~dp0"
echo Menghapus file prototipe lama...

for %%F in (
  "src\components\LayoutHeader.jsx"
  "src\components\RoomFooterNav.jsx"
  "src\components\TeacherModeModal.jsx"
  "src\components\UnlockModal.jsx"
  "src\data\hakikuData.js"
  "src\screens\FinaleScreen.jsx"
  "src\screens\IntroScreen.jsx"
  "src\screens\PlaceholderRoomScreen.jsx"
  "src\screens\Room1Screen.jsx"
  "src\screens\Room2Screen.jsx"
  "src\screens\Room5Screen.jsx"
  "src\screens\WorldMapScreen.jsx"
  "src\utils\storage.js"
  "src\utils\storage.test.js"
) do (
  if exist %%F del /q %%F
)

if exist "docs\superpowers" rmdir /s /q "docs\superpowers"
if exist "dist" rmdir /s /q "dist"
if exist "versi-hybrid" rmdir /s /q "versi-hybrid"

echo.
echo Selesai. Sekarang jalankan:  npm install  lalu  npm run dev
echo File ini boleh dihapus setelah dijalankan.
pause
