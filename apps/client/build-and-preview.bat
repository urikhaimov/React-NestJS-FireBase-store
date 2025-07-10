@echo off
echo ============================
echo Building the project...
echo ============================

npm run build

echo ============================
echo Previewing the project...
echo ============================

start http://localhost:4173
npm run preview
