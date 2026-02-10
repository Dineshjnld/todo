@echo off
REM AWS S3 Deployment Script for Todo App (Windows)

setlocal enabledelayedexpansion

if "%1"=="" (
    echo.
    echo AWS S3 Deployment Script
    echo =======================
    echo.
    echo Usage: deploy.bat BUCKET_NAME [REGION]
    echo.
    echo Examples:
    echo   deploy.bat my-todo-app-2026
    echo   deploy.bat my-todo-app-2026 us-west-2
    echo.
    exit /b 1
)

set BUCKET_NAME=%1
set REGION=%2
if "!REGION!"=="" set REGION=us-east-1

echo.
echo Deploying Todo App to S3
echo =======================
echo Bucket: !BUCKET_NAME!
echo Region: !REGION!
echo.

REM Upload files
echo Uploading files...
aws s3 cp index.html s3://!BUCKET_NAME!/ --content-type "text/html"
aws s3 cp styles.css s3://!BUCKET_NAME!/ --content-type "text/css"
aws s3 cp script.js s3://!BUCKET_NAME!/ --content-type "application/javascript"

echo.
if errorlevel 1 (
    echo ❌ Deployment failed
    exit /b 1
)

echo ✅ Deployment successful!
echo.
echo Your app is available at:
echo http://!BUCKET_NAME!.s3-website-!REGION!.amazonaws.com
echo.

endlocal
