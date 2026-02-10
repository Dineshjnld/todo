# Complete CI/CD Pipeline Setup - Todo App

## Overview

This project includes a complete CI/CD pipeline using GitHub Actions to automatically deploy your Todo app to AWS S3.

**Architecture:**
```
Your Computer → Git Push
                   ↓
            GitHub Repository
                   ↓
            GitHub Actions Workflow
                   ↓
            AWS S3 Bucket
                   ↓
            Live Web App! 🎉
```

## Project Structure

```
aws/
├── .github/
│   └── workflows/
│       ├── deploy.yml              # Basic CI/CD workflow
│       └── deploy-advanced.yml     # Advanced workflow with validation
├── index.html                       # Todo app interface
├── styles.css                       # App styling
├── script.js                        # App logic
├── deploy.py                        # Manual Python deployment script
├── GITHUB_ACTIONS_QUICK.md          # Quick start guide
├── CICD_SETUP.md                    # Detailed setup documentation
├── README.md                        # General deployment guide
└── .gitignore                       # Git ignore rules
```

## Quick Start (5 minutes)

### 1. Initialize Git Repository
```bash
cd /path/to/aws
git init
git add .
git commit -m "Initial commit: Todo app with CI/CD"
git branch -M main
```

### 2. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
git push -u origin main
```

### 3. Add GitHub Secrets
Go to GitHub → Settings → Secrets and variables → Actions

Add 4 secrets:
- `AWS_ACCESS_KEY_ID` = Your AWS access key
- `AWS_SECRET_ACCESS_KEY` = Your AWS secret key
- `S3_BUCKET` = my-todo-app-2026 (your bucket name)
- `AWS_REGION` = us-east-1 (your region)

### 4. Test the Pipeline
Go to Actions tab → Run workflow manually → Watch it deploy! 🚀

## GitHub Actions Workflows

### Basic Workflow (`deploy.yml`)
- **Triggers:** Push to main/master
- **What it does:** Uploads files to S3
- **Good for:** Getting started
- **Time:** ~1-2 minutes

### Advanced Workflow (`deploy-advanced.yml`)
- **Triggers:** Push to main/master
- **What it does:**
  - Validates file existence
  - Checks HTML/CSS/JS syntax
  - Uploads with cache headers
  - Verifies deployment
  - Generates reports
- **Good for:** Production deployments
- **Time:** ~2-3 minutes

## How to Use

### Automatic Deployment (CI/CD)
Just push your code:
```bash
git add .
git commit -m "Update app"
git push
```

The workflow automatically:
1. Checks out your code
2. Validates files
3. Uploads to S3
4. Verifies deployment
5. Shows confirmation

### Manual Deployment (Without GitHub)
Still available via Python script:
```bash
python deploy.py --bucket my-todo-app-2026 --create
```

## Workflow Details

### Triggers
The workflow runs when:
- ✅ Code pushed to `main` or `master` branch
- ✅ Pull request created to `main` or `master`
- ✅ Manually triggered via "Run workflow" button

### Steps Executed
1. **Checkout** - Gets your code from GitHub
2. **Configure AWS** - Sets up AWS credentials from secrets
3. **Validate** - Checks files exist and syntax is valid
4. **Deploy** - Uploads files to S3 with proper content types
5. **Verify** - Confirms files are in S3
6. **Notify** - Shows deployment confirmation

### Environment Variables
Set in GitHub Secrets (not hardcoded):
```
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJal...
S3_BUCKET=my-todo-app-2026
AWS_REGION=us-east-1
```

## Cache Control Headers

Files are uploaded with intelligent caching:

| File | Cache Duration | Purpose |
|------|---|---|
| index.html | 1 hour | Update frequently |
| styles.css | 1 year | Rarely changes |
| script.js | 1 year | Rarely changes |

This makes your app fast and responsive!

## Security

✅ **GitHub Secrets** - Credentials encrypted and never exposed
✅ **No hardcoded keys** - All sensitive data in secrets
✅ **Least privilege** - IAM user has only S3 access
✅ **Audit trail** - All deployments logged in GitHub Actions
✅ **Review gates** - Optional branch protection rules

## Monitoring

### View Workflow Runs
1. Go to GitHub repo
2. Click **Actions** tab
3. See all workflow runs with status ✅ or ❌

### View Logs
1. Click the workflow run
2. Click the **deploy** job
3. Expand individual steps to see logs

### Download Artifacts
Advanced workflow generates `deployment-report.txt`:
1. Click workflow run
2. Scroll to **Artifacts**
3. Download deployment report

## Troubleshooting

### Workflow Not Running
**Problem:** Workflow doesn't appear in Actions
**Solution:** 
- Check branch name is `main` or `master`
- Check `.github/workflows/deploy.yml` exists
- Try pushing again

### Deployment Fails with AccessDenied
**Problem:** AWS credentials error
**Solution:**
- Verify AWS secrets in GitHub settings
- Check AWS user has S3 permissions
- Try manual deployment with `python deploy.py`

### Files Not Updating in Browser
**Problem:** Old version still showing
**Solution:**
- Hard refresh: Ctrl+Shift+Del (Windows) or Cmd+Shift+Del (Mac)
- Clear browser cache
- Use incognito/private mode

### Slow Deployment
**Problem:** Workflow takes too long
**Solution:**
- Use basic `deploy.yml` instead of advanced
- Check AWS region (pick closest to you)
- Optimize file sizes

## Advanced Configuration

### Deploy Only on Tags
Edit `deploy.yml` line 7:
```yaml
on:
  push:
    tags:
      - 'v*'  # Only deploy on version tags like v1.0.0
```

### Deploy Multiple Branches
Edit `deploy.yml` line 7:
```yaml
branches:
  - main
  - develop
  - staging
```

### Add Slack Notifications
Add to workflow:
```yaml
- name: Notify Slack
  if: success()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -d '{"text":"✅ App deployed to S3!"}'
```

(First add `SLACK_WEBHOOK` secret)

### Deploy to CloudFront
Add after S3 upload:
```yaml
- name: Invalidate CloudFront
  run: |
    aws cloudfront create-invalidation \
      --distribution-id ${{ secrets.CF_DISTRIBUTION_ID }} \
      --paths "/*"
```

## Deployment History

All deployments are tracked in GitHub Actions:
- View who deployed
- See when each deployment happened
- Check deployment logs
- Download artifacts

## Next Steps

1. ✅ Create GitHub repository
2. ✅ Add AWS secrets to GitHub
3. ✅ Test workflow with manual run
4. ✅ Push code and watch it deploy
5. ✅ Monitor in Actions tab
6. ✅ Share your live app URL

## Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **AWS CLI in Actions:** https://github.com/aws-actions/configure-aws-credentials
- **S3 CLI Commands:** https://docs.aws.amazon.com/cli/latest/userguide/cli-services-s3.html
- **YAML Syntax:** https://yaml.org/

## Support

**GitHub Actions Issues:**
- Check **Actions** tab for logs
- See GitHub Actions documentation

**AWS Issues:**
- Check IAM permissions
- Verify S3 bucket exists
- Check AWS region

**Questions:**
- Read `GITHUB_ACTIONS_QUICK.md` for quick help
- Read `CICD_SETUP.md` for detailed setup

---

**You now have a professional CI/CD pipeline!** 🚀

Every push automatically deploys your app to S3. No manual steps needed.
