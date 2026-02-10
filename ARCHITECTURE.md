# GitHub Actions CI/CD Architecture

## Complete System Diagram

```
┌────────────────────────────────────────────────────────────────┐
│                     YOUR LOCAL COMPUTER                         │
│                                                                  │
│  1. Edit files                                                  │
│     ├─ index.html                                              │
│     ├─ styles.css                                              │
│     └─ script.js                                               │
│                                                                  │
│  2. Commit changes                                              │
│     $ git add .                                                 │
│     $ git commit -m "Update app"                               │
│                                                                  │
│  3. Push to GitHub                                              │
│     $ git push origin main                                      │
└──────────────────────┬─────────────────────────────────────────┘
                       │
                       │ Git webhook triggered
                       ↓
┌────────────────────────────────────────────────────────────────┐
│              GITHUB REPOSITORY                                  │
│              github.com/YOUR_USERNAME/todo-app                 │
│                                                                  │
│  Files Stored:                                                  │
│  ├─ index.html                                                 │
│  ├─ styles.css                                                 │
│  ├─ script.js                                                  │
│  └─ .github/workflows/deploy.yml ───┐                          │
│                                       │                         │
│  Triggers Available:                  │                         │
│  ✅ Push to main branch               │ Defines workflow        │
│  ✅ Pull request to main              │                         │
│  ✅ Manual "Run workflow" button       │                         │
└────────────────────────────────────────┼──────────────────────┘
                                         │
                                         │ Uses GitHub Secrets:
                                         │ - AWS_ACCESS_KEY_ID
                                         │ - AWS_SECRET_ACCESS_KEY
                                         │ - S3_BUCKET
                                         │ - AWS_REGION
                                         ↓
┌────────────────────────────────────────────────────────────────┐
│           GITHUB ACTIONS RUNNER (Virtual Machine)              │
│                                                                  │
│  Step 1: Checkout Code                                         │
│  ├─ Uses: actions/checkout@v4                                  │
│  └─ Clones your repo                                            │
│                                                                  │
│  Step 2: Configure AWS Credentials                              │
│  ├─ Uses: aws-actions/configure-aws-credentials@v4             │
│  ├─ Loads: AWS_ACCESS_KEY_ID (from secrets)                    │
│  ├─ Loads: AWS_SECRET_ACCESS_KEY (from secrets)                │
│  └─ Sets region from AWS_REGION secret                         │
│                                                                  │
│  Step 3: Validate Files (Advanced workflow)                     │
│  ├─ Checks: Files exist                                         │
│  ├─ Checks: HTML has DOCTYPE                                    │
│  ├─ Checks: CSS is valid                                        │
│  └─ Checks: JavaScript syntax                                   │
│                                                                  │
│  Step 4: Deploy to S3                                           │
│  ├─ Uploads index.html with Cache-Control: 1 hour              │
│  ├─ Uploads styles.css with Cache-Control: 1 year              │
│  ├─ Uploads script.js with Cache-Control: 1 year               │
│  └─ Sets proper Content-Type headers                            │
│                                                                  │
│  Step 5: Verify Deployment                                      │
│  ├─ Checks: Files exist in S3                                   │
│  ├─ Lists: All files in bucket                                  │
│  └─ Confirms: Deployment successful                             │
│                                                                  │
│  Step 6: Generate Report (Advanced)                             │
│  └─ Creates: deployment-report.txt artifact                     │
│                                                                  │
│  Status: ✅ All steps completed successfully                    │
└──────────────────────┬─────────────────────────────────────────┘
                       │
                       │ AWS CLI commands with credentials
                       ↓
┌────────────────────────────────────────────────────────────────┐
│                  AWS S3 BUCKET                                  │
│              (my-todo-app-2026)                                │
│                                                                  │
│  Bucket Configuration:                                          │
│  ├─ Region: us-east-1                                           │
│  ├─ Static Website Hosting: Enabled                             │
│  ├─ Index Document: index.html                                  │
│  └─ Public Access: Enabled                                      │
│                                                                  │
│  Files Stored:                                                  │
│  ├─ index.html    (5 KB, updated 2026-02-11)                  │
│  ├─ styles.css    (8 KB, updated 2026-02-11)                  │
│  └─ script.js     (12 KB, updated 2026-02-11)                 │
│                                                                  │
│  Object URLs:                                                   │
│  ├─ https://s3.amazonaws.com/my-todo-app-2026/index.html      │
│  ├─ https://s3.amazonaws.com/my-todo-app-2026/styles.css     │
│  └─ https://s3.amazonaws.com/my-todo-app-2026/script.js      │
│                                                                  │
│  Website Endpoint:                                              │
│  └─ http://my-todo-app-2026.s3-website-us-east-1.amazonaws.com │
│                                                                  │
│  Cache Settings:                                                │
│  ├─ index.html: Cache 1 hour (can update frequently)           │
│  ├─ styles.css: Cache 1 year (rarely changes)                 │
│  └─ script.js: Cache 1 year (rarely changes)                  │
└──────────────────────┬─────────────────────────────────────────┘
                       │
                       │ HTTP requests over internet
                       ↓
┌────────────────────────────────────────────────────────────────┐
│                    USER BROWSER                                 │
│                                                                  │
│  URL: http://my-todo-app-2026.s3-website-us-east-1.amazonaws.com
│                                                                  │
│  ┌─────────────────────────────────────┐                       │
│  │  📝 My Todo App                     │                       │
│  ├─────────────────────────────────────┤                       │
│  │  Add Task: [____________] [Add]     │                       │
│  ├─────────────────────────────────────┤                       │
│  │  ✅ Buy groceries     [Delete]      │                       │
│  │  ☐ Do laundry         [Delete]      │                       │
│  │  ☐ Finish project     [Delete]      │                       │
│  └─────────────────────────────────────┘                       │
│                                                                  │
│  Features:                                                      │
│  ✅ Add new tasks                                              │
│  ✅ Mark as complete                                            │
│  ✅ Delete tasks                                                │
│  ✅ Data persists (localStorage)                               │
│  ✅ Works offline                                               │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
Developer Makes Changes
        │
        ↓
┌──────────────────┐
│  Local Git Repo  │
│  $ git push      │
└────────┬─────────┘
         │
         ↓
┌─────────────────────────────────────────────────────────┐
│     GitHub Receives Push                                │
│     → Webhook triggered                                 │
│     → Finds .github/workflows/deploy.yml                │
│     → Starts GitHub Actions runner                      │
└────────┬────────────────────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────────────────────┐
│     GitHub Actions Executes Steps                      │
│     1. Checkout code from GitHub                       │
│     2. Load AWS credentials from GitHub Secrets        │
│     3. Run validation scripts                          │
│     4. Execute AWS CLI commands                        │
│     5. Monitor AWS API responses                       │
│     6. Generate logs and reports                       │
└────────┬───────────────────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────────────────────┐
│     AWS S3 Receives Upload                             │
│     → Creates/updates objects                          │
│     → Sets metadata and cache headers                  │
│     → Replicates to edge servers worldwide             │
│     → CDN cache invalidation (optional)                │
└────────┬───────────────────────────────────────────────┘
         │
         ↓
┌────────────────────────────────────────────────────────┐
│     Website Live!                                      │
│     → Accessible worldwide via CloudFront CDN          │
│     → Cached at edge locations for speed              │
│     → Auto-updates on every push                       │
│     → Zero downtime deployments                        │
└────────────────────────────────────────────────────────┘
```

## Workflow Execution Timeline

```
12:30:45 - Developer: git push origin main
    │
12:30:46 - GitHub: Push received
    │       Webhook triggered
    │
12:30:47 - GitHub Actions: Runner started
    │       Environment: Ubuntu 22.04
    │       Available: AWS CLI, Git, Node.js
    │
12:30:48 - Step 1/6: Checkout code
    │       ✅ Completed in 2 seconds
    │
12:30:50 - Step 2/6: Configure AWS
    │       ✅ Credentials loaded (0.5s)
    │
12:31:00 - Step 3/6: Validate files
    │       ✅ HTML valid
    │       ✅ CSS valid
    │       ✅ JavaScript valid
    │       ✅ Completed in 5 seconds
    │
12:31:15 - Step 4/6: Deploy to S3
    │       📤 Uploading index.html (2s)
    │       📤 Uploading styles.css (1s)
    │       📤 Uploading script.js (1s)
    │       ✅ All uploaded in 5 seconds
    │
12:31:25 - Step 5/6: Verify
    │       ✅ index.html found
    │       ✅ styles.css found
    │       ✅ script.js found
    │       ✅ Completed in 2 seconds
    │
12:31:27 - Step 6/6: Report
    │       ✅ Report generated
    │       ✅ Completed in 1 second
    │
12:31:28 - Workflow Complete!
    │       Total time: 43 seconds
    │       Status: ✅ SUCCESS
    │
12:31:30 - Developer: App updated live!
           ✅ Visible in S3 website
           ✅ Users can access new version
```

## Security Flow

```
Developer
    │
    ├─→ git push (HTTPS encrypted)
    │
GitHub Repository
    ├─→ Stores code securely
    ├─→ Secrets encrypted at rest
    └─→ Audit logs all deployments
    
GitHub Actions
    ├─→ Runs in isolated VM
    ├─→ No hardcoded credentials
    ├─→ Reads credentials from Secrets Manager
    ├─→ Credentials only in RAM during execution
    ├─→ All actions are logged
    └─→ Credentials never printed in logs
    
AWS IAM
    ├─→ Validates credentials
    ├─→ Checks S3 permissions
    ├─→ Logs all API calls
    └─→ Enforces least privilege
    
AWS S3
    ├─→ Server-side encryption
    ├─→ ACLs for access control
    ├─→ Versioning available
    ├─→ Access logs available
    └─→ MFA delete optional
```

## Benefits Summary

```
┌────────────────────────────────────────┐
│         BEFORE (Manual)                │
├────────────────────────────────────────┤
│ • Manual file uploads                  │
│ • Easy to forget files                 │
│ • Hand-edited files on AWS             │
│ • No history of changes                │
│ • Risk of human error                  │
│ • Slow deployment (5-10 min)          │
│ • No validation                        │
│ • Inconsistent process                 │
└────────────────────────────────────────┘
               ↓↓↓
           Use CI/CD
               ↓↓↓
┌────────────────────────────────────────┐
│         AFTER (Automated)              │
├────────────────────────────────────────┤
│ • Automatic uploads on push            │
│ • All files deployed                   │
│ • Code-based configuration             │
│ • Full Git history                     │
│ • Validations prevent errors           │
│ • Fast deployment (<2 min)             │
│ • Automated checks                     │
│ • Consistent every time                │
└────────────────────────────────────────┘
```

---

This CI/CD pipeline brings **enterprise-grade automation** to your project! 🚀
