#!/usr/bin/env pwsh
# Quick setup and deployment script for Todo App on AWS S3

param(
    [Parameter(Mandatory=$true)]
    [string]$BucketName,
    
    [Parameter(Mandatory=$false)]
    [string]$Region = "us-east-1",
    
    [Parameter(Mandatory=$false)]
    [switch]$CreateBucket
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "AWS S3 Todo App - Quick Setup & Deploy" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if AWS CLI is installed
Write-Host "[1/4] Checking AWS CLI..." -ForegroundColor Yellow
try {
    $awsVersion = aws --version
    Write-Host "✅ AWS CLI found: $awsVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ AWS CLI not found. Install from: https://aws.amazon.com/cli/" -ForegroundColor Red
    exit 1
}

# Check if configured
Write-Host "`n[2/4] Checking AWS credentials..." -ForegroundColor Yellow
try {
    $identity = aws sts get-caller-identity --region $Region 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ AWS credentials configured" -ForegroundColor Green
    } else {
        Write-Host "❌ AWS credentials not configured. Run: aws configure" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ AWS credentials not found. Run: aws configure" -ForegroundColor Red
    exit 1
}

# Create bucket if requested
if ($CreateBucket) {
    Write-Host "`n[3/4] Creating S3 bucket..." -ForegroundColor Yellow
    try {
        if ($Region -eq "us-east-1") {
            aws s3 mb "s3://$BucketName" --region $Region 2>&1
        } else {
            aws s3 mb "s3://$BucketName" --region $Region --create-bucket-configuration LocationConstraint=$Region 2>&1
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Bucket created: $BucketName" -ForegroundColor Green
            
            # Enable static website hosting
            Write-Host "   Enabling static website hosting..." -ForegroundColor Cyan
            aws s3 website "s3://$BucketName" --index-document index.html --error-document index.html --region $Region 2>&1
            Write-Host "   ✅ Static website hosting enabled" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to create bucket. It may already exist." -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Error: $_" -ForegroundColor Red
    }
} else {
    Write-Host "`n[3/4] Skipping bucket creation (use -CreateBucket flag to create)" -ForegroundColor Yellow
}

# Deploy files
Write-Host "`n[4/4] Deploying app files..." -ForegroundColor Yellow
$files = @("index.html", "styles.css", "script.js")
$deployed = 0

foreach ($file in $files) {
    if (Test-Path $file) {
        $contentType = switch ($file) {
            "index.html" { "text/html" }
            "styles.css" { "text/css" }
            "script.js" { "application/javascript" }
            default { "application/octet-stream" }
        }
        
        aws s3 cp $file "s3://$BucketName/" --content-type $contentType --region $Region 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Uploaded: $file" -ForegroundColor Green
            $deployed++
        } else {
            Write-Host "❌ Failed to upload: $file" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ File not found: $file" -ForegroundColor Red
    }
}

# Show results
Write-Host "`n========================================" -ForegroundColor Cyan
if ($deployed -eq 3) {
    Write-Host "✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    $endpoint = "http://$BucketName.s3-website-$Region.amazonaws.com"
    Write-Host "`nYour app is available at:" -ForegroundColor Yellow
    Write-Host $endpoint -ForegroundColor Cyan
    Write-Host "`nAccess it in your browser to verify!" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  DEPLOYMENT INCOMPLETE" -ForegroundColor Yellow
    Write-Host "Successfully deployed: $deployed/3 files" -ForegroundColor Yellow
}
Write-Host "========================================`n" -ForegroundColor Cyan
