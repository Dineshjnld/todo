# 🚀 GitHub Actions CI/CD Quick Setup (5 minutes)

Deploy your app to AWS S3 automatically every time you push code!

## What This Does

Every time you push to GitHub → automatically uploads to S3 → live in seconds ⚡

## 3 Simple Steps

### Step 1: Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/todo-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### Step 2: Add AWS Secrets to GitHub

1. Go to your repo on GitHub: `https://github.com/YOUR_USERNAME/todo-app`
2. Click **Settings** (top right)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **New repository secret** button

**Add these 4 secrets:**

```
Name: AWS_ACCESS_KEY_ID
Value: AKIATVBPOUCVQXG2KWIX
```

```
Name: AWS_SECRET_ACCESS_KEY
Value: (your secret key from AWS CSV)
```

```
Name: S3_BUCKET
Value: my-todo-app-2026
```

```
Name: AWS_REGION
Value: us-east-1
```

### Step 3: Test It!

Go to **Actions** tab → Click **Deploy to AWS S3** → Click **Run workflow**

Watch it deploy live! 🎉

## That's It!

Now whenever you push code:
```bash
git add .
git commit -m "Update app"
git push
```

Your app automatically deploys to S3! ✅

## Files Structure

```
.
├── .github/
│   └── workflows/
│       ├── deploy.yml           # Main workflow (simple)
│       └── deploy-advanced.yml  # Advanced workflow (with tests)
├── index.html
├── styles.css
├── script.js
└── deploy.py
```

## Workflows Available

### 1. Basic Deploy (`deploy.yml`)
- Fast and simple
- Just uploads files
- Use this to start

### 2. Advanced Deploy (`deploy-advanced.yml`)
- Validates files first
- Checks HTML/CSS/JS syntax
- Generates deployment reports
- Better for production

## Useful Links

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **AWS Actions**: https://github.com/aws-actions
- **Settings**: Go to Settings → Secrets and variables → Actions

## Troubleshoot

**Workflow not running?**
- Check branch is named `main` or `master`
- Check secrets are added correctly

**Deployment failing?**
- Go to Actions tab and click the failed run
- Scroll down to see error logs

**Need to update credentials?**
- Go to Settings → Secrets and variables → Actions
- Click the secret and update value

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Watch workflow run in Actions tab
3. ✅ See app update live in S3
4. ✅ Share your live URL!

---

Your app is now CI/CD ready! 🚀 Every push = automatic deployment.
