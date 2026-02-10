# ✅ CI/CD Setup Checklist

Complete this checklist to set up your GitHub Actions CI/CD pipeline.

## Prerequisites
- [ ] GitHub account at https://github.com
- [ ] AWS account with S3 bucket created (`my-todo-app-2026`)
- [ ] AWS access keys (from AWS Console)
- [ ] Git installed locally

## Step 1: Prepare Local Repository
- [ ] Have these files in your project:
  - [ ] `index.html`
  - [ ] `styles.css`
  - [ ] `script.js`
  - [ ] `.github/workflows/deploy.yml`
  - [ ] `.gitignore`

## Step 2: Initialize Git & Push to GitHub

### Local Setup
```bash
cd /path/to/aws
git init
git add .
git commit -m "Initial commit: Todo app with CI/CD"
git branch -M main
```

### Create GitHub Repository
- [ ] Go to https://github.com/new
- [ ] Create repo named `todo-app`
- [ ] **Do NOT** initialize with README/gitignore (we have them)
- [ ] Click **Create repository**

### Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
git push -u origin main
```

**Verify:** Go to https://github.com/YOUR_USERNAME/todo-app and see your files

## Step 3: Add AWS Secrets to GitHub

### Get Your AWS Keys
- [ ] Go to AWS Console: https://console.aws.amazon.com/
- [ ] Click account name → **My Security Credentials**
- [ ] Go to **Access keys**
- [ ] Have ready:
  - [ ] Access Key ID (starts with `AKIA`)
  - [ ] Secret Access Key (long string)
  - [ ] S3 bucket name
  - [ ] AWS region (e.g., `us-east-1`)

### Add Secrets to GitHub
1. [ ] Go to your repo: `https://github.com/YOUR_USERNAME/todo-app`
2. [ ] Click **Settings** tab
3. [ ] Click **Secrets and variables** → **Actions**
4. [ ] Click **New repository secret** for each:

**Secret 1: AWS_ACCESS_KEY_ID**
- [ ] Name: `AWS_ACCESS_KEY_ID`
- [ ] Value: `AKIA...` (your access key)
- [ ] Click **Add secret**

**Secret 2: AWS_SECRET_ACCESS_KEY**
- [ ] Name: `AWS_SECRET_ACCESS_KEY`
- [ ] Value: (your secret key)
- [ ] Click **Add secret**

**Secret 3: S3_BUCKET**
- [ ] Name: `S3_BUCKET`
- [ ] Value: `my-todo-app-2026` (exact bucket name)
- [ ] Click **Add secret**

**Secret 4: AWS_REGION**
- [ ] Name: `AWS_REGION`
- [ ] Value: `us-east-1` (your region)
- [ ] Click **Add secret**

**Verify:** Go to Settings → Secrets and see all 4 secrets

## Step 4: Test the Pipeline

### Method A: Manual Trigger (Recommended for first test)
1. [ ] Go to **Actions** tab
2. [ ] Click **Deploy to AWS S3** workflow
3. [ ] Click **Run workflow** button
4. [ ] Select **main** branch
5. [ ] Click **Run workflow**
6. [ ] Watch the workflow run in real-time
7. [ ] Verify ✅ All steps passed
8. [ ] Check S3 bucket contains new files

**Expected time:** 1-2 minutes

### Method B: Push Code (Tests automatic trigger)
```bash
echo "<!-- Updated -->" >> index.html
git add .
git commit -m "Test deployment"
git push
```

1. [ ] Go to **Actions** tab
2. [ ] See new workflow run appear
3. [ ] Wait for ✅ completion
4. [ ] Verify files updated in S3

## Step 5: Verify Deployment

### Check S3 Bucket
- [ ] Go to https://console.aws.amazon.com/s3/
- [ ] Click your bucket `my-todo-app-2026`
- [ ] See 3 files: `index.html`, `styles.css`, `script.js`
- [ ] Check modification times match deployment

### Access Your App
- [ ] Open URL: `http://my-todo-app-2026.s3-website-us-east-1.amazonaws.com`
- [ ] App loads successfully ✅
- [ ] Todo app is functional
- [ ] Can add/complete/delete tasks

## Step 6: Start Using CI/CD

### Daily Workflow
```bash
# Make changes to app
# Then deploy automatically:
git add .
git commit -m "Update app"
git push
# → Workflow runs → App updates automatically ✅
```

- [ ] Try updating `styles.css`
- [ ] Push to GitHub
- [ ] Watch deployment in Actions
- [ ] Verify changes live in S3

## Troubleshooting Checklist

**Workflow not appearing?**
- [ ] Check `.github/workflows/deploy.yml` exists in repo
- [ ] Current branch is `main` (not `master` or other)
- [ ] Pushed all files to GitHub

**Workflow fails with "AccessDenied"?**
- [ ] Check AWS_SECRET_ACCESS_KEY secret is correct
- [ ] Verify AWS user has S3 permissions
- [ ] Try manual deployment: `python deploy.py --bucket my-todo-app-2026`

**Secrets not working?**
- [ ] All 4 secrets added to GitHub?
- [ ] No typos in secret names?
- [ ] Secret values copied exactly?

**App not loading in browser?**
- [ ] Hard refresh: Ctrl+Shift+Del
- [ ] Check URL is correct: `http://BUCKET.s3-website-REGION.amazonaws.com`
- [ ] Files uploaded to S3 bucket?

## Optional Enhancements

- [ ] Add branch protection rules (Settings → Branches)
- [ ] Enable security alerts (Settings → Code security)
- [ ] Set up notifications (Actions settings)
- [ ] Create deployment tags (`git tag v1.0.0 && git push --tags`)

## Success Indicators

✅ **You're done if:**
1. All 4 secrets added to GitHub
2. Workflow runs successfully (green ✅)
3. Files appear in S3 bucket
4. App loads in browser
5. Changes push = auto-deployment

## Resources

- **Quick Start:** `GITHUB_ACTIONS_QUICK.md`
- **Detailed Docs:** `CICD_SETUP.md`
- **Complete Guide:** `CICD_COMPLETE.md`
- **GitHub Issues:** Check Actions tab logs
- **AWS Issues:** Check IAM permissions

---

## Final Verification

Run through this ONE MORE TIME:

1. [ ] Repository on GitHub with all files
2. [ ] 4 secrets in GitHub (Settings → Secrets)
3. [ ] Workflow in `.github/workflows/deploy.yml`
4. [ ] Manual workflow run completed ✅
5. [ ] Files in S3 bucket
6. [ ] App loads at S3 website URL
7. [ ] Can make changes and auto-deploy

**If all checked:** 🎉 Your CI/CD pipeline is LIVE!

## Get Help

1. Check logs in Actions tab
2. Read `GITHUB_ACTIONS_QUICK.md`
3. Review AWS credentials
4. Verify S3 bucket settings
5. Check file permissions in GitHub secrets

---

**Everything working?** Congratulations! You have professional CI/CD! 🚀
