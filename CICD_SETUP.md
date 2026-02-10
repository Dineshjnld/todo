# GitHub Actions CI/CD Pipeline Setup

This document explains how to set up automated deployment to AWS S3 using GitHub Actions.

## Overview

When you push code to GitHub (main/master branch), the workflow automatically:
1. ✅ Checks out your code
2. ✅ Configures AWS credentials
3. ✅ Validates files exist
4. ✅ Uploads files to S3 with correct content types
5. ✅ Verifies deployment
6. ✅ Shows deployment confirmation

## Prerequisites

- ✅ GitHub account with this repo
- ✅ AWS account with S3 bucket created
- ✅ AWS access keys (Access Key ID + Secret Access Key)

## Step 1: Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: Todo app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 2: Add GitHub Secrets

Go to your GitHub repository:

1. Click **Settings** (top right)
2. Click **Secrets and variables** → **Actions** (left sidebar)
3. Click **New repository secret**

Add these 4 secrets:

### Secret 1: AWS_ACCESS_KEY_ID
- **Name**: `AWS_ACCESS_KEY_ID`
- **Value**: `AKIATVBPOUCVQXG2KWIX` (your access key)
- Click **Add secret**

### Secret 2: AWS_SECRET_ACCESS_KEY
- **Name**: `AWS_SECRET_ACCESS_KEY`
- **Value**: Your secret access key from AWS CSV file
- Click **Add secret**

### Secret 3: S3_BUCKET
- **Name**: `S3_BUCKET`
- **Value**: `my-todo-app-2026` (your bucket name)
- Click **Add secret**

### Secret 4: AWS_REGION
- **Name**: `AWS_REGION`
- **Value**: `us-east-1` (or your region)
- Click **Add secret**

## Step 3: Test the Pipeline

### Trigger Manually:
1. Go to **Actions** tab in GitHub
2. Click **Deploy to AWS S3** workflow
3. Click **Run workflow** button
4. Check the logs to see deployment happen in real-time

### Or Trigger Automatically:
Push a change to the repo:
```bash
echo "<!-- Updated -->" >> index.html
git add .
git commit -m "Update app"
git push
```

Then go to **Actions** tab and watch the workflow run!

## Workflow File

The workflow is defined in `.github/workflows/deploy.yml`

### What it does:
```yaml
- Triggers on: push to main/master branch
- Runs on: Ubuntu latest
- Steps:
  1. Checkout code
  2. Configure AWS credentials (from secrets)
  3. Validate files exist
  4. Upload files to S3 with caching headers
  5. Verify files in bucket
  6. Show deployment confirmation
```

### Customization:

**Change branches** (edit line 7-8):
```yaml
branches:
  - main
  - develop    # Add this
```

**Change bucket name** (use in secrets):
Update `S3_BUCKET` secret in GitHub settings

**Change deployment paths** (edit lines 13-16):
```yaml
paths:
  - 'index.html'
  - 'styles.css'
  - 'script.js'
  - 'src/**'    # Add this to deploy src folder changes
```

## Monitoring Deployment

1. Go to **Actions** tab in GitHub
2. Click the workflow run
3. Click the **deploy** job
4. Expand any step to see logs

### Example Log Output:
```
✅ Configuring AWS credentials
✅ index.html found
✅ styles.css found
✅ script.js found
🚀 Deploying to S3 bucket: my-todo-app-2026
✅ Files uploaded successfully
🔍 Verifying files in S3...
✅ DEPLOYMENT SUCCESSFUL
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Workflow doesn't run | Check branch name is main/master |
| Access Denied error | Verify AWS credentials in secrets |
| Wrong bucket | Check S3_BUCKET secret |
| Files not updating | Check paths in workflow (line 13-16) |
| 403 Forbidden | Enable public access in S3 bucket settings |

## Next: Advanced Features

### 1. Test & Lint Before Deploy

Add to workflow:
```yaml
- name: Run linter
  run: echo "Linting JavaScript..." && node -c script.js
```

### 2. Notify on Success/Failure

Add to workflow:
```yaml
- name: Notify Slack
  if: success()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -d '{"text":"✅ App deployed to S3"}'
```

### 3. Deploy Only on Tag

Change trigger:
```yaml
on:
  push:
    tags:
      - 'v*'  # Only deploy on version tags
```

### 4. CloudFront Cache Invalidation

Add step after deploy:
```yaml
- name: Invalidate CloudFront
  run: |
    aws cloudfront create-invalidation \
      --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} \
      --paths "/*"
```

## Security Best Practices

✅ **Never commit credentials** - Use GitHub Secrets
✅ **Use least privilege** - Give IAM user only S3 permissions
✅ **Rotate keys regularly** - Update secrets every 90 days
✅ **Monitor deployments** - Check logs for unauthorized access
✅ **Use branch protection** - Require reviews before merging to main

## Useful Commands

### View GitHub workflows locally:
```bash
gh workflow list
gh workflow view deploy.yml
```

### Check deployment status:
```bash
gh run list
gh run view <run-id>
```

### Cancel a running workflow:
```bash
gh run cancel <run-id>
```

## Success Checklist

- ✅ Created `.github/workflows/deploy.yml`
- ✅ Added 4 secrets to GitHub
- ✅ Pushed code to main branch
- ✅ Ran workflow manually via Actions tab
- ✅ Verified app updated in S3
- ✅ Accessed app via S3 website URL

Your CI/CD pipeline is now live! 🎉
