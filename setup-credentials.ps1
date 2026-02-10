#!/usr/bin/env pwsh
# Easy AWS Credentials Setup for Windows PowerShell

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "AWS Credentials Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "This will set your AWS credentials as environment variables.`n" -ForegroundColor Yellow

$AccessKey = Read-Host "Enter AWS Access Key ID"
$SecretKey = Read-Host "Enter AWS Secret Access Key"

# Set environment variables (permanent for this user)
[System.Environment]::SetEnvironmentVariable('AWS_ACCESS_KEY_ID', $AccessKey, 'User')
[System.Environment]::SetEnvironmentVariable('AWS_SECRET_ACCESS_KEY', $SecretKey, 'User')

# Also set for current session
$env:AWS_ACCESS_KEY_ID = $AccessKey
$env:AWS_SECRET_ACCESS_KEY = $SecretKey

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "✅ Credentials saved!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

Write-Host "Your AWS credentials are now set and will be used for deployment.`n" -ForegroundColor Yellow

Write-Host "Next step: Run the deploy script`n" -ForegroundColor Cyan
$response = Read-Host "Deploy now? (y/n)"

if ($response -eq 'y' -or $response -eq 'yes') {
    $bucketName = Read-Host "Enter bucket name (e.g., my-todo-app-2026)"
    python deploy.py --bucket $bucketName --create --region us-east-1
} else {
    Write-Host "`nWhen ready, run:`n" -ForegroundColor Yellow
    Write-Host "  python deploy.py --bucket my-todo-app-2026 --create`n" -ForegroundColor Cyan
}
