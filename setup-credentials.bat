@echo off
REM Easy AWS Credentials Setup for Windows

echo.
echo ====================================
echo AWS Credentials Setup
echo ====================================
echo.
echo This will set your AWS credentials as environment variables.
echo They will work for this session only.
echo.

set /p ACCESS_KEY="Enter AWS Access Key ID: "
set /p SECRET_KEY="Enter AWS Secret Access Key: "

setx AWS_ACCESS_KEY_ID "%ACCESS_KEY%"
setx AWS_SECRET_ACCESS_KEY "%SECRET_KEY%"

echo.
echo ====================================
echo ✅ Credentials saved!
echo ====================================
echo.
echo Your AWS credentials are now set in environment variables.
echo.
echo Next, run:
echo   python deploy.py --bucket my-todo-app-2026 --create
echo.
pause
