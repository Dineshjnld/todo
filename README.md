# My Todo App - AWS S3 Deployment

Simple Todo application ready to deploy to AWS S3 using Python (no AWS CLI needed!).

## Files

- `index.html` - Todo app interface
- `styles.css` - Modern styling
- `script.js` - App logic with local storage
- `deploy.py` - Python deployment script (handles everything!)

## Prerequisites

1. **AWS Account** - Create at https://aws.amazon.com/
2. **Python 3** - Already installed on most systems
3. **boto3** - AWS SDK for Python (installed automatically)

That's it! No AWS CLI required!

## Setup (3 Steps)

### Step 1: Get AWS Credentials (5 minutes)

1. Go to https://console.aws.amazon.com/
2. Click your account name → **My Security Credentials**
3. Navigate to **Access keys**
4. Click **Create New Access Key**
5. Download the credentials (keep safe!)

You'll have:
- **Access Key ID** (example: `AKIAIOSFODNN7EXAMPLE`)
- **Secret Access Key** (example: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`)

### Step 2: Set AWS Credentials in Your System

**Option A: Environment Variables (Windows)**
```powershell
$env:AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
$env:AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
```

**Option B: Environment Variables (Linux/Mac)**
```bash
export AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="YOUR_SECRET_ACCESS_KEY"
```

**Option C: Credentials File (All platforms)**

Create file `~/.aws/credentials` with:
```
[default]
aws_access_key_id = YOUR_ACCESS_KEY_ID
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```

### Step 3: Deploy!

```bash
python deploy.py --bucket my-todo-app-2026 --create --region us-east-1
```

Replace `my-todo-app-2026` with a **unique name** (globally unique across all S3 buckets).

**That's it!** The script will:
- ✅ Create the S3 bucket
- ✅ Enable static website hosting
- ✅ Make it public
- ✅ Upload all files
- ✅ Show you the live URL

## Troubleshooting

- **Access Denied**: Check your AWS credentials and IAM permissions
- **Bucket Already Exists**: S3 bucket names must be globally unique
- **Website Not Loading**: Ensure static website hosting is enabled
- **CORS Issues**: Add CORS configuration if needed

## Updates

To update your app after making changes:

```bash
aws s3 sync . s3://my-todo-app-2026/ --exclude "*.py" --exclude "README.md" --exclude ".gitignore" --delete
```

## Cost

- AWS S3 Free Tier: 5GB storage, 20,000 GET requests, 2,000 PUT requests per month
- This simple app should stay within free tier limits
