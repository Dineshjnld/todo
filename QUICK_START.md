# 🚀 Quick Start - Deploy to AWS S3 (No CLI Needed!)

## What You Have

A complete Todo app ready to deploy:
- ✨ Interactive todo list
- 🎨 Beautiful modern design  
- 💾 Local storage (data persists)

## Deploy in 3 Steps (10 minutes)

### Step 1: Get AWS Credentials (5 min)

1. Sign up at https://aws.amazon.com/ (free)
2. Go to https://console.aws.amazon.com/
3. Click your **account name** → **My Security Credentials**
4. Go to **Access keys** section
5. Click **Create New Access Key**
6. **Save the CSV file** with your keys:
   - `AKIA...` = Access Key ID
   - `wJal...` = Secret Access Key

### Step 2: Set Credentials (Choose One)

**On Windows:**
```powershell
$env:AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
$env:AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
```

**On Mac/Linux:**
```bash
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
```

**Or create `~/.aws/credentials` file:**
```
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```

### Step 3: Run Deploy Script

```bash
python deploy.py --bucket my-todo-app-2026 --create --region us-east-1
```

**Change `my-todo-app-2026` to your unique bucket name**

✅ The script automatically:
- Creates S3 bucket
- Enables static hosting
- Makes it public
- Uploads all files
- Shows your live URL

### Step 4: Access Your App

You'll get a URL like:
```
http://my-todo-app-2026.s3-website-us-east-1.amazonaws.com
```

Open it in your browser! ✨

## Troubleshooting

| Error | Solution |
|-------|----------|
| Credentials not found | Run Step 2 (set environment variables) |
| Bucket already exists | Choose a different bucket name |
| Python not found | Install from python.org |

## Update Your App

Changed something? Redeploy:
```bash
python deploy.py --bucket my-todo-app-2026
```

## Cost

✅ **FREE** - AWS Free Tier includes:
- 5 GB storage
- 20,000 GET requests/month
- This app easily fits!

---

**That's it! Your todo app is live on AWS S3!** 🎉
