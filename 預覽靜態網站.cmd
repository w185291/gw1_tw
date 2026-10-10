@echo off
setlocal
cd /d "%~dp0"

if not exist "out\index.html" (
  echo 找不到 out\index.html，請先執行靜態建置。
  pause
  exit /b 1
)

set "NODE_EXE="
for %%I in (node.exe) do set "NODE_EXE=%%~$PATH:I"
if not defined NODE_EXE if exist "C:\Users\roger\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set "NODE_EXE=C:\Users\roger\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not defined NODE_EXE (
  echo 找不到 Node.js，請先安裝 Node.js 22 或使用 Codex 的預覽網址。
  pause
  exit /b 1
)

set "PORT=8766"
start "GW1 靜態網站預覽" /min "%NODE_EXE%" "%~dp0scripts\preview-static.mjs"
timeout /t 2 /nobreak >nul

if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
  start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://127.0.0.1:8766/"
) else (
  start "" "http://127.0.0.1:8766/"
)
echo 已開啟靜態成品預覽：http://127.0.0.1:8766/
